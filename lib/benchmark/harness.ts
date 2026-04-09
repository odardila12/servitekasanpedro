/**
 * Performance Benchmark Harness
 * Captures user interactions, performance metrics, and Core Web Vitals
 */

export type EventType = 'click' | 'navigate' | 'input' | 'scroll' | 'resize' | 'focus' | 'blur';

export interface BenchmarkEvent {
  type: EventType;
  timestamp: number;
  duration?: number;
  target?: string;
  metadata?: Record<string, unknown>;
  url?: string;
}

export interface WebVitalMetrics {
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

export interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize?: number;
  totalJSHeapSize?: number;
  jsHeapSizeLimit?: number;
}

export interface BenchmarkSnapshot {
  events: BenchmarkEvent[];
  metrics: WebVitalMetrics;
  memory: MemorySnapshot[];
  startTime: number;
  endTime: number;
}

/**
 * EventRecorder: Captures all user interactions
 */
export class EventRecorder {
  private events: BenchmarkEvent[] = [];
  private startTime: number = 0;
  private isRecording: boolean = false;

  start(): void {
    this.events = [];
    this.startTime = performance.now();
    this.isRecording = true;
    this.attachListeners();
  }

  stop(): BenchmarkEvent[] {
    this.isRecording = false;
    this.detachListeners();
    return this.events;
  }

  private attachListeners(): void {
    // Click events
    document.addEventListener('click', this.handleClick.bind(this), true);

    // Navigation events
    window.addEventListener('popstate', this.handleNavigation.bind(this));
    const originalPushState = window.history.pushState;
    window.history.pushState = (...args: unknown[]) => {
      this.handleNavigation();
      return originalPushState.apply(window.history, args as Parameters<typeof originalPushState>);
    };

    // Input events
    document.addEventListener('input', this.handleInput.bind(this), true);

    // Scroll events (throttled)
    document.addEventListener('scroll', this.handleScroll.bind(this), true);

    // Resize events
    window.addEventListener('resize', this.handleResize.bind(this));

    // Focus/Blur
    document.addEventListener('focus', this.handleFocus.bind(this), true);
    document.addEventListener('blur', this.handleBlur.bind(this), true);
  }

  private detachListeners(): void {
    document.removeEventListener('click', this.handleClick.bind(this), true);
    window.removeEventListener('popstate', this.handleNavigation.bind(this));
    document.removeEventListener('input', this.handleInput.bind(this), true);
    document.removeEventListener('scroll', this.handleScroll.bind(this), true);
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('focus', this.handleFocus.bind(this), true);
    document.removeEventListener('blur', this.handleBlur.bind(this), true);
  }

  private recordEvent(type: EventType, metadata?: Record<string, unknown>): void {
    if (!this.isRecording) return;

    const event: BenchmarkEvent = {
      type,
      timestamp: performance.now() - this.startTime,
      url: window.location.href,
      metadata,
    };

    this.events.push(event);
  }

  private handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    this.recordEvent('click', {
      tagName: target?.tagName,
      id: target?.id,
      className: target?.className,
      text: target?.textContent?.slice(0, 100),
    });
  }

  private handleNavigation(): void {
    this.recordEvent('navigate', {
      url: window.location.href,
    });
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.recordEvent('input', {
      tagName: target?.tagName,
      id: target?.id,
      value: target?.value?.slice(0, 50),
    });
  }

  private handleScroll(): void {
    this.recordEvent('scroll', {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
    });
  }

  private handleResize(): void {
    this.recordEvent('resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  private handleFocus(event: Event): void {
    const target = event.target as HTMLElement;
    this.recordEvent('focus', {
      tagName: target?.tagName,
      id: target?.id,
    });
  }

  private handleBlur(event: Event): void {
    const target = event.target as HTMLElement;
    this.recordEvent('blur', {
      tagName: target?.tagName,
      id: target?.id,
    });
  }

  getEvents(): BenchmarkEvent[] {
    return this.events;
  }

  addEvent(event: BenchmarkEvent): void {
    this.events.push(event);
  }
}

/**
 * MetricsCollector: Gathers Core Web Vitals and performance metrics
 */
export class MetricsCollector {
  private metrics: WebVitalMetrics = {};
  private memorySnapshots: MemorySnapshot[] = [];
  private isCollecting: boolean = false;
  private memoryInterval?: NodeJS.Timeout;

  start(): void {
    this.metrics = {};
    this.memorySnapshots = [];
    this.isCollecting = true;

    // Observe Core Web Vitals
    this.observeWebVitals();

    // Start memory sampling (every 500ms)
    this.memoryInterval = setInterval(() => {
      this.captureMemorySnapshot();
    }, 500);

    // Capture initial navigation timing
    this.captureNavigationTiming();
  }

  stop(): void {
    this.isCollecting = false;
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
    }
  }

  private observeWebVitals(): void {
    // Observe LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.LCP = Math.round(lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP observer not supported
      }

      try {
        // Observe FCP (First Contentful Paint)
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.FCP = Math.round(fcpEntry.startTime);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        // FCP observer not supported
      }

      try {
        // Observe CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let cls = 0;
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          });
          this.metrics.CLS = Math.round(cls * 1000) / 1000;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS observer not supported
      }

      try {
        // Observe FID (First Input Delay) via PerformanceObserver
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstInput = entries[0] as any;
          if (firstInput) {
            this.metrics.FID = Math.round(firstInput.processingEnd - firstInput.startTime);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // FID observer not supported
      }
    }
  }

  private captureNavigationTiming(): void {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      this.metrics.TTFB = timing.responseStart - timing.navigationStart;
    }
  }

  private captureMemorySnapshot(): void {
    if (!this.isCollecting) return;

    const snapshot: MemorySnapshot = {
      timestamp: performance.now(),
    };

    if ('memory' in performance) {
      const memory = (performance as any).memory;
      snapshot.usedJSHeapSize = memory.usedJSHeapSize;
      snapshot.totalJSHeapSize = memory.totalJSHeapSize;
      snapshot.jsHeapSizeLimit = memory.jsHeapSizeLimit;
    }

    this.memorySnapshots.push(snapshot);
  }

  getMetrics(): WebVitalMetrics {
    return { ...this.metrics };
  }

  getMemorySnapshots(): MemorySnapshot[] {
    return [...this.memorySnapshots];
  }
}

/**
 * BenchmarkHarness: Orchestrates recording and metrics collection
 */
export class BenchmarkHarness {
  private recorder: EventRecorder;
  private collector: MetricsCollector;
  private startTime: number = 0;
  private endTime: number = 0;

  constructor() {
    this.recorder = new EventRecorder();
    this.collector = new MetricsCollector();
  }

  start(): void {
    this.startTime = performance.now();
    this.recorder.start();
    this.collector.start();
  }

  stop(): BenchmarkSnapshot {
    this.endTime = performance.now();
    const events = this.recorder.stop();
    this.collector.stop();

    return {
      events,
      metrics: this.collector.getMetrics(),
      memory: this.collector.getMemorySnapshots(),
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  getSnapshot(): BenchmarkSnapshot {
    return {
      events: this.recorder.getEvents(),
      metrics: this.collector.getMetrics(),
      memory: this.collector.getMemorySnapshots(),
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }

  addEvent(event: BenchmarkEvent): void {
    this.recorder.addEvent(event);
  }

  static serialize(snapshot: BenchmarkSnapshot): string {
    return JSON.stringify(snapshot, null, 2);
  }

  static deserialize(json: string): BenchmarkSnapshot {
    return JSON.parse(json);
  }
}
