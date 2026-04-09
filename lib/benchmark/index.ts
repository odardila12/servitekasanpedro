/**
 * Benchmark Harness - Public API
 * Export all benchmark utilities
 */

export { BenchmarkHarness, EventRecorder, MetricsCollector } from './harness';
export type { BenchmarkEvent, BenchmarkSnapshot, WebVitalMetrics, MemorySnapshot, EventType } from './harness';

export { EventReplayer, TimingAnalyzer } from './replay';
export type { ReplayOptions, ReplayReport, TimingValidationResult } from './replay';

export { PerformanceAnalyzer } from './analyzer';
export type { PerformanceAnalysis, EventMetrics, CriticalPath, Bottleneck, UserExperienceScore, Recommendation } from './analyzer';

// Helper to get or create the global harness instance
export function getGlobalHarness() {
  if (typeof window !== 'undefined') {
    if (!(window as any).__globalBenchmarkHarness) {
      const { BenchmarkHarness } = require('./harness');
      (window as any).__globalBenchmarkHarness = new BenchmarkHarness();
    }
    return (window as any).__globalBenchmarkHarness;
  }
  return null;
}
