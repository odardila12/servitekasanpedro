/**
 * Performance Analysis Tools
 * Advanced analysis and reporting for benchmark data
 */

import { BenchmarkSnapshot, BenchmarkEvent, WebVitalMetrics } from './harness';
import { TimingAnalyzer } from './replay';

export interface PerformanceAnalysis {
  eventMetrics: EventMetrics;
  criticalPath: CriticalPath;
  userExperience: UserExperienceScore;
  recommendations: Recommendation[];
}

export interface EventMetrics {
  totalEvents: number;
  byType: Record<string, number>;
  clustering: EventCluster[];
  criticalEvents: BenchmarkEvent[];
}

export interface EventCluster {
  startIndex: number;
  endIndex: number;
  count: number;
  duration: number;
  type: string;
  avgSpacing: number;
}

export interface CriticalPath {
  events: BenchmarkEvent[];
  duration: number;
  bottlenecks: Bottleneck[];
}

export interface Bottleneck {
  event: BenchmarkEvent;
  duration: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
}

export interface UserExperienceScore {
  overall: number; // 0-100
  responsiveness: number; // 0-100
  stability: number; // 0-100
  efficiency: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

/**
 * PerformanceAnalyzer: Advanced analysis of benchmark data
 */
export class PerformanceAnalyzer {
  /**
   * Analyze complete benchmark snapshot
   */
  static analyze(snapshot: BenchmarkSnapshot): PerformanceAnalysis {
    const eventMetrics = this.analyzeEvents(snapshot.events);
    const criticalPath = this.identifyCriticalPath(snapshot.events);
    const userExperience = this.scoreUserExperience(snapshot);
    const recommendations = this.generateRecommendations(
      snapshot,
      eventMetrics,
      criticalPath,
      userExperience
    );

    return {
      eventMetrics,
      criticalPath,
      userExperience,
      recommendations,
    };
  }

  /**
   * Analyze event patterns and clustering
   */
  private static analyzeEvents(events: BenchmarkEvent[]): EventMetrics {
    const byType: Record<string, number> = {};
    const clustering: EventCluster[] = [];
    let currentCluster: Partial<EventCluster> | null = null;
    let clusterStartIndex = 0;

    // Count events by type
    events.forEach((event) => {
      byType[event.type] = (byType[event.type] || 0) + 1;
    });

    // Identify clusters (groups of events with <500ms spacing)
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const prevEvent = i > 0 ? events[i - 1] : null;
      const spacing = prevEvent ? event.timestamp - prevEvent.timestamp : 0;

      if (spacing > 500) {
        // End current cluster
        if (currentCluster && currentCluster.count) {
          clustering.push({
            startIndex: clusterStartIndex,
            endIndex: i - 1,
            count: currentCluster.count,
            duration: currentCluster.duration || 0,
            type: currentCluster.type || 'mixed',
            avgSpacing: currentCluster.avgSpacing || 0,
          });
        }
        currentCluster = null;
      } else {
        // Continue or start cluster
        if (!currentCluster) {
          clusterStartIndex = i;
          currentCluster = {
            count: 1,
            type: event.type,
            duration: 0,
            avgSpacing: 0,
          };
        } else {
          currentCluster.count = (currentCluster.count || 0) + 1;
        }
      }

      if (currentCluster) {
        currentCluster.duration = event.timestamp - events[clusterStartIndex].timestamp;
      }
    }

    // Critical events (navigations and user interactions)
    const criticalEvents = events.filter(
      (e) => e.type === 'navigate' || ['click', 'input'].includes(e.type)
    );

    return {
      totalEvents: events.length,
      byType,
      clustering,
      criticalEvents,
    };
  }

  /**
   * Identify the critical path through the user journey
   */
  private static identifyCriticalPath(events: BenchmarkEvent[]): CriticalPath {
    // Critical path includes navigations and any event followed by a long delay
    const criticalEvents = events.filter((e, i) => {
      if (e.type === 'navigate') return true;
      if (i < events.length - 1) {
        const nextSpacing = events[i + 1].timestamp - e.timestamp;
        return nextSpacing > 1000; // Events followed by >1s delay
      }
      return false;
    });

    const bottlenecks: Bottleneck[] = [];
    for (let i = 1; i < events.length; i++) {
      const spacing = events[i].timestamp - events[i - 1].timestamp;
      if (spacing > 1000) {
        const severity = spacing > 3000 ? 'critical' : spacing > 2000 ? 'high' : 'medium';
        bottlenecks.push({
          event: events[i],
          duration: spacing,
          severity: severity as any,
          impact: `${spacing.toFixed(0)}ms delay before ${events[i].type}`,
        });
      }
    }

    const duration = events.length > 0 ? events[events.length - 1].timestamp - events[0].timestamp : 0;

    return {
      events: criticalEvents,
      duration,
      bottlenecks,
    };
  }

  /**
   * Score user experience based on metrics and patterns
   */
  private static scoreUserExperience(snapshot: BenchmarkSnapshot): UserExperienceScore {
    let responsiveness = 100;
    let stability = 100;
    let efficiency = 100;

    const { metrics } = snapshot;

    // Responsiveness: Based on LCP, FCP, FID
    if (metrics.LCP && metrics.LCP > 2500) responsiveness -= 20;
    else if (metrics.LCP && metrics.LCP > 1500) responsiveness -= 10;

    if (metrics.FCP && metrics.FCP > 1800) responsiveness -= 15;
    else if (metrics.FCP && metrics.FCP > 1000) responsiveness -= 5;

    if (metrics.FID && metrics.FID > 100) responsiveness -= 20;
    else if (metrics.FID && metrics.FID > 50) responsiveness -= 10;

    // Stability: Based on CLS
    if (metrics.CLS && metrics.CLS > 0.1) stability -= 30;
    else if (metrics.CLS && metrics.CLS > 0.05) stability -= 15;

    // Efficiency: Based on event density and clustering
    const timing = TimingAnalyzer.analyzeEventTimings(snapshot.events);
    if (timing.eventDensity > 20) efficiency -= 15;
    else if (timing.eventDensity > 10) efficiency -= 8;

    // Memory pressure
    const memorySnapshots = snapshot.memory || [];
    if (memorySnapshots.length > 0) {
      const lastMemory = memorySnapshots[memorySnapshots.length - 1];
      if (lastMemory.usedJSHeapSize && lastMemory.usedJSHeapSize > 100 * 1024 * 1024) {
        efficiency -= 20;
      }
    }

    responsiveness = Math.max(0, Math.min(100, responsiveness));
    stability = Math.max(0, Math.min(100, stability));
    efficiency = Math.max(0, Math.min(100, efficiency));

    const overall = Math.round((responsiveness + stability + efficiency) / 3);
    const grade = overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F';

    return { overall, responsiveness, stability, efficiency, grade };
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(
    snapshot: BenchmarkSnapshot,
    eventMetrics: EventMetrics,
    criticalPath: CriticalPath,
    userExperience: UserExperienceScore
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const { metrics } = snapshot;

    // Responsiveness recommendations
    if (metrics.LCP && metrics.LCP > 2500) {
      recommendations.push({
        priority: 'critical',
        category: 'Responsiveness',
        title: 'Optimize Largest Contentful Paint (LCP)',
        description: `LCP is ${metrics.LCP}ms, exceeding the 2.5s threshold. Optimize image loading, reduce render-blocking resources, and leverage lazy loading.`,
        impact: 'Users experience slower perceived performance',
        effort: 'high',
      });
    }

    if (metrics.FCP && metrics.FCP > 1800) {
      recommendations.push({
        priority: 'high',
        category: 'Responsiveness',
        title: 'Reduce First Contentful Paint (FCP)',
        description: `FCP is ${metrics.FCP}ms. Consider reducing CSS/JS bundle sizes, deferring non-critical scripts, and optimizing critical resources.`,
        impact: 'Slower page paint impacts perceived performance',
        effort: 'medium',
      });
    }

    // Stability recommendations
    if (metrics.CLS && metrics.CLS > 0.1) {
      recommendations.push({
        priority: 'high',
        category: 'Stability',
        title: 'Reduce Cumulative Layout Shift (CLS)',
        description: `CLS is ${metrics.CLS}, indicating unstable layout. Add size constraints to images/videos, avoid inserting content above existing content, and use transform animations.`,
        impact: 'Users experience unexpected layout changes',
        effort: 'medium',
      });
    }

    // Efficiency recommendations
    if (eventMetrics.clustering.length > 5) {
      recommendations.push({
        priority: 'medium',
        category: 'Efficiency',
        title: 'Reduce Event Clustering',
        description: `Detected ${eventMetrics.clustering.length} event clusters. Consider debouncing/throttling event handlers and batching DOM updates.`,
        impact: 'Excessive event handling impacts performance',
        effort: 'medium',
      });
    }

    if (criticalPath.bottlenecks.length > 3) {
      recommendations.push({
        priority: 'high',
        category: 'Performance',
        title: 'Address Critical Bottlenecks',
        description: `Found ${criticalPath.bottlenecks.length} bottlenecks with long delays. Investigate slow operations, long tasks, and blocking I/O.`,
        impact: 'Users experience unresponsive page interactions',
        effort: 'high',
      });
    }

    // Memory recommendations
    const memorySnapshots = snapshot.memory || [];
    if (memorySnapshots.length > 0) {
      const lastMemory = memorySnapshots[memorySnapshots.length - 1];
      if (lastMemory.usedJSHeapSize && lastMemory.usedJSHeapSize > 75 * 1024 * 1024) {
        recommendations.push({
          priority: 'medium',
          category: 'Memory',
          title: 'Profile JavaScript Memory',
          description: `JS heap size is ${(lastMemory.usedJSHeapSize / 1024 / 1024).toFixed(0)}MB. Look for memory leaks, inefficient data structures, or excessive event listeners.`,
          impact: 'High memory usage can cause crashes on low-end devices',
          effort: 'high',
        });
      }
    }

    // Grade-based recommendations
    if (userExperience.grade === 'F' || userExperience.grade === 'D') {
      recommendations.unshift({
        priority: 'critical',
        category: 'General',
        title: `Critical Performance Issues (Grade: ${userExperience.grade})`,
        description:
          'Overall performance score is poor. Prioritize LCP, FCP, and layout stability improvements immediately.',
        impact: 'Significant user experience degradation',
        effort: 'high',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Generate human-readable summary
   */
  static generateSummary(analysis: PerformanceAnalysis): string {
    const { userExperience, criticalPath, recommendations } = analysis;

    const lines = [
      '═══════════════════════════════════════════',
      '       PERFORMANCE ANALYSIS SUMMARY        ',
      '═══════════════════════════════════════════',
      '',
      `Overall Score: ${userExperience.overall}/100 (Grade: ${userExperience.grade})`,
      `├─ Responsiveness: ${userExperience.responsiveness}/100`,
      `├─ Stability:      ${userExperience.stability}/100`,
      `└─ Efficiency:     ${userExperience.efficiency}/100`,
      '',
      `Critical Path Duration: ${criticalPath.duration.toFixed(0)}ms`,
      `Bottlenecks Found: ${criticalPath.bottlenecks.length}`,
      '',
      `Top Recommendations:`,
    ];

    const topRecs = recommendations.slice(0, 3);
    topRecs.forEach((rec, i) => {
      lines.push(
        `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`,
        `   ${rec.description.substring(0, 80)}...`,
        ''
      );
    });

    if (recommendations.length > 3) {
      lines.push(`... and ${recommendations.length - 3} more recommendations`);
    }

    lines.push('═══════════════════════════════════════════');

    return lines.join('\n');
  }
}
