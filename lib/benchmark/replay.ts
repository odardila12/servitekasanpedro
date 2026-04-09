/**
 * Event Replayer: Reproduces recorded events in order for validation
 */

import { BenchmarkEvent, BenchmarkSnapshot } from './harness';

export interface ReplayOptions {
  speedMultiplier?: number; // 1 = real-time, 2 = 2x speed
  autoScroll?: boolean;
  logEvents?: boolean;
}

export interface ReplayReport {
  totalEvents: number;
  eventsReplayed: number;
  timingValidation: TimingValidationResult[];
  errors: string[];
  duration: number;
}

export interface TimingValidationResult {
  eventIndex: number;
  event: BenchmarkEvent;
  expectedDelay: number;
  actualDelay: number;
  variance: number; // percentage
  passed: boolean;
}

/**
 * EventReplayer: Replays events and validates timing
 */
export class EventReplayer {
  private snapshot: BenchmarkSnapshot;
  private options: Required<ReplayOptions>;
  private timingValidation: TimingValidationResult[] = [];
  private errors: string[] = [];
  private replayStartTime: number = 0;

  constructor(snapshot: BenchmarkSnapshot, options: ReplayOptions = {}) {
    this.snapshot = snapshot;
    this.options = {
      speedMultiplier: options.speedMultiplier ?? 1,
      autoScroll: options.autoScroll ?? false,
      logEvents: options.logEvents ?? true,
    };
  }

  async replay(): Promise<ReplayReport> {
    this.replayStartTime = performance.now();
    this.timingValidation = [];
    this.errors = [];

    const events = this.snapshot.events;
    let previousEventTime = 0;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      try {
        // Calculate delay from previous event
        const delay = event.timestamp - previousEventTime;
        const adjustedDelay = delay / this.options.speedMultiplier;

        if (previousEventTime > 0) {
          // Wait for adjusted delay
          await this.sleep(adjustedDelay);
        }

        // Measure actual timing
        const replayEventStartTime = performance.now();

        // Replay the event
        await this.replayEvent(event);

        const replayEventDuration = performance.now() - replayEventStartTime;

        // Validate timing
        const variance = ((replayEventDuration - delay) / delay) * 100;
        this.timingValidation.push({
          eventIndex: i,
          event,
          expectedDelay: delay,
          actualDelay: replayEventDuration,
          variance,
          passed: Math.abs(variance) < 25, // Within 25% is acceptable
        });

        if (this.options.logEvents) {
          console.log(
            `[${i}] Replayed ${event.type} at ${event.timestamp.toFixed(0)}ms (variance: ${variance.toFixed(1)}%)`
          );
        }

        previousEventTime = event.timestamp;
      } catch (error) {
        const errorMsg = `Error replaying event ${i}: ${error instanceof Error ? error.message : String(error)}`;
        this.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    const replayDuration = performance.now() - this.replayStartTime;

    return {
      totalEvents: events.length,
      eventsReplayed: events.length - this.errors.length,
      timingValidation: this.timingValidation,
      errors: this.errors,
      duration: replayDuration,
    };
  }

  private async replayEvent(event: BenchmarkEvent): Promise<void> {
    switch (event.type) {
      case 'click':
        await this.replayClick(event);
        break;
      case 'navigate':
        await this.replayNavigation(event);
        break;
      case 'input':
        await this.replayInput(event);
        break;
      case 'scroll':
        await this.replayScroll(event);
        break;
      case 'resize':
        // Resize events are harder to replay, skip
        break;
      default:
        // Other events (focus, blur) - no action needed
        break;
    }
  }

  private async replayClick(event: BenchmarkEvent): Promise<void> {
    const className = event.metadata?.className as string | undefined;
    const target = document.querySelector(
      `[id="${event.metadata?.id}"], .${className?.split(' ')[0]}`
    );

    if (target instanceof HTMLElement) {
      target.click();
    }
  }

  private async replayNavigation(event: BenchmarkEvent): Promise<void> {
    const url = event.metadata?.url as string | undefined;
    if (url && url !== window.location.href) {
      window.history.pushState({}, '', url);
    }
  }

  private async replayInput(event: BenchmarkEvent): Promise<void> {
    const target = document.querySelector(`input#${event.metadata?.id}, textarea#${event.metadata?.id}`);

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      target.value = (event.metadata?.value as string) || '';
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private async replayScroll(event: BenchmarkEvent): Promise<void> {
    if (this.options.autoScroll) {
      window.scrollTo({
        left: (event.metadata?.scrollX as number) || 0,
        top: (event.metadata?.scrollY as number) || 0,
      });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getTimingValidation(): TimingValidationResult[] {
    return [...this.timingValidation];
  }

  getErrors(): string[] {
    return [...this.errors];
  }
}

/**
 * Timing Analyzer: Analyzes timing patterns from events
 */
export class TimingAnalyzer {
  static analyzeEventTimings(events: BenchmarkEvent[]): {
    averageEventSpacing: number;
    maxEventSpacing: number;
    minEventSpacing: number;
    eventDensity: number; // events per second
  } {
    if (events.length < 2) {
      return { averageEventSpacing: 0, maxEventSpacing: 0, minEventSpacing: 0, eventDensity: 0 };
    }

    const spacings: number[] = [];
    for (let i = 1; i < events.length; i++) {
      spacings.push(events[i].timestamp - events[i - 1].timestamp);
    }

    const totalTime = events[events.length - 1].timestamp - events[0].timestamp;
    const eventDensity = (events.length / totalTime) * 1000; // events per second

    return {
      averageEventSpacing: spacings.reduce((a, b) => a + b, 0) / spacings.length,
      maxEventSpacing: Math.max(...spacings),
      minEventSpacing: Math.min(...spacings),
      eventDensity,
    };
  }

  static identifyBottlenecks(
    events: BenchmarkEvent[],
    threshold: number = 500 // ms
  ): BenchmarkEvent[] {
    if (events.length < 2) return [];

    const bottlenecks: BenchmarkEvent[] = [];

    for (let i = 1; i < events.length; i++) {
      const spacing = events[i].timestamp - events[i - 1].timestamp;
      if (spacing > threshold) {
        bottlenecks.push(events[i]);
      }
    }

    return bottlenecks;
  }

  static groupEventsByType(events: BenchmarkEvent[]): Record<string, BenchmarkEvent[]> {
    return events.reduce(
      (groups, event) => {
        if (!groups[event.type]) {
          groups[event.type] = [];
        }
        groups[event.type].push(event);
        return groups;
      },
      {} as Record<string, BenchmarkEvent[]>
    );
  }
}
