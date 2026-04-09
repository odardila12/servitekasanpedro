/**
 * Example Usage Patterns for the Benchmark Harness
 * Copy and adapt these examples for your use cases
 */

import React from 'react';
import {
  BenchmarkHarness,
  PerformanceAnalyzer,
  EventReplayer,
  TimingAnalyzer,
} from '@/lib/benchmark';
import type { BenchmarkSnapshot } from '@/lib/benchmark';

/**
 * Example 1: Basic Manual Benchmarking
 * Run this in browser console to capture a quick benchmark
 */
export async function example_quickBenchmark() {
  console.log('Starting quick benchmark...');

  const harness = new BenchmarkHarness();
  harness.start();

  // Simulate user interactions (replace with actual)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const snapshot = harness.stop();

  console.log('Benchmark complete!');
  console.log(`Total events: ${snapshot.events.length}`);
  console.log(`Duration: ${(snapshot.endTime - snapshot.startTime).toFixed(0)}ms`);
  console.log(`LCP: ${snapshot.metrics.LCP}ms`);

  return snapshot;
}

/**
 * Example 2: Analyze a Snapshot and Get Recommendations
 */
export function example_analyzeAndGetRecommendations(snapshot: BenchmarkSnapshot) {
  const analysis = PerformanceAnalyzer.analyze(snapshot);

  console.log('PERFORMANCE ANALYSIS');
  console.log('===================\n');

  console.log(`Overall Score: ${analysis.userExperience.overall}/100 (${analysis.userExperience.grade})`);
  console.log(`├─ Responsiveness: ${analysis.userExperience.responsiveness}/100`);
  console.log(`├─ Stability: ${analysis.userExperience.stability}/100`);
  console.log(`└─ Efficiency: ${analysis.userExperience.efficiency}/100\n`);

  console.log('TOP RECOMMENDATIONS:');
  analysis.recommendations.slice(0, 5).forEach((rec, i) => {
    console.log(`\n${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
    console.log(`   ${rec.description}`);
    console.log(`   Impact: ${rec.impact}`);
    console.log(`   Effort: ${rec.effort}`);
  });

  return analysis;
}

/**
 * Example 3: Compare Two Benchmarks (Before/After Optimization)
 */
export function example_compareSnapshots(before: BenchmarkSnapshot, after: BenchmarkSnapshot) {
  const beforeAnalysis = PerformanceAnalyzer.analyze(before);
  const afterAnalysis = PerformanceAnalyzer.analyze(after);

  const improvement = {
    scoreChange: afterAnalysis.userExperience.overall - beforeAnalysis.userExperience.overall,
    responsivenessChange:
      afterAnalysis.userExperience.responsiveness - beforeAnalysis.userExperience.responsiveness,
    stabilityChange: afterAnalysis.userExperience.stability - beforeAnalysis.userExperience.stability,
    efficiencyChange: afterAnalysis.userExperience.efficiency - beforeAnalysis.userExperience.efficiency,
    eventCountChange: after.events.length - before.events.length,
    durationChange: (after.endTime - after.startTime) - (before.endTime - before.startTime),
  };

  console.log('BENCHMARK COMPARISON (Before vs After)');
  console.log('=====================================\n');

  console.log(`Overall Score: ${beforeAnalysis.userExperience.overall} → ${afterAnalysis.userExperience.overall} (${improvement.scoreChange > 0 ? '+' : ''}${improvement.scoreChange})`);
  console.log(`Responsiveness: ${beforeAnalysis.userExperience.responsiveness} → ${afterAnalysis.userExperience.responsiveness} (${improvement.responsivenessChange > 0 ? '+' : ''}${improvement.responsivenessChange})`);
  console.log(`Stability: ${beforeAnalysis.userExperience.stability} → ${afterAnalysis.userExperience.stability} (${improvement.stabilityChange > 0 ? '+' : ''}${improvement.stabilityChange})`);
  console.log(`Efficiency: ${beforeAnalysis.userExperience.efficiency} → ${afterAnalysis.userExperience.efficiency} (${improvement.efficiencyChange > 0 ? '+' : ''}${improvement.efficiencyChange})`);

  console.log(`\nEvents: ${before.events.length} → ${after.events.length} (${improvement.eventCountChange > 0 ? '+' : ''}${improvement.eventCountChange})`);
  console.log(
    `Duration: ${(before.endTime - before.startTime).toFixed(0)}ms → ${(after.endTime - after.startTime).toFixed(0)}ms (${improvement.durationChange > 0 ? '+' : ''}${improvement.durationChange.toFixed(0)}ms)`
  );

  return improvement;
}

/**
 * Example 4: Replay a Recorded Session
 */
export async function example_replaySession(snapshot: BenchmarkSnapshot) {
  console.log('Starting event replay...');

  const replayer = new EventReplayer(snapshot, {
    speedMultiplier: 2, // 2x speed
    autoScroll: true,
    logEvents: true,
  });

  const report = await replayer.replay();

  console.log(`Replay complete!`);
  console.log(`Events replayed: ${report.eventsReplayed}/${report.totalEvents}`);
  console.log(`Duration: ${report.duration.toFixed(0)}ms`);
  console.log(`Errors: ${report.errors.length}`);

  if (report.errors.length > 0) {
    console.warn('Replay errors:');
    report.errors.forEach((err) => console.warn(`  - ${err}`));
  }

  return report;
}

/**
 * Example 5: Identify Performance Patterns
 */
export function example_identifyPatterns(snapshot: BenchmarkSnapshot) {
  const timing = TimingAnalyzer.analyzeEventTimings(snapshot.events);
  const bottlenecks = TimingAnalyzer.identifyBottlenecks(snapshot.events, 1000);
  const grouped = TimingAnalyzer.groupEventsByType(snapshot.events);

  console.log('EVENT PATTERN ANALYSIS');
  console.log('====================\n');

  console.log('Timing Statistics:');
  console.log(`  Average spacing: ${timing.averageEventSpacing.toFixed(0)}ms`);
  console.log(`  Max spacing: ${timing.maxEventSpacing.toFixed(0)}ms`);
  console.log(`  Min spacing: ${timing.minEventSpacing.toFixed(0)}ms`);
  console.log(`  Event density: ${timing.eventDensity.toFixed(2)} events/sec\n`);

  console.log('Event Distribution:');
  Object.entries(grouped).forEach(([type, events]) => {
    console.log(`  ${type}: ${events.length} (${((events.length / snapshot.events.length) * 100).toFixed(1)}%)`);
  });

  console.log(`\nBottlenecks (>1000ms gap): ${bottlenecks.length}`);
  bottlenecks.forEach((event, i) => {
    const prevEvent = snapshot.events[snapshot.events.indexOf(event) - 1];
    if (prevEvent) {
      const gap = event.timestamp - prevEvent.timestamp;
      console.log(`  ${i + 1}. ${event.type} at ${event.timestamp.toFixed(0)}ms (gap: ${gap.toFixed(0)}ms)`);
    }
  });
}

/**
 * Example 6: Export Report to JSON
 */
export function example_exportReport(snapshot: BenchmarkSnapshot, filename: string = 'benchmark.json') {
  const analysis = PerformanceAnalyzer.analyze(snapshot);

  const report = {
    timestamp: new Date().toISOString(),
    snapshot,
    analysis: {
      overall: analysis.userExperience.overall,
      grade: analysis.userExperience.grade,
      responsiveness: analysis.userExperience.responsiveness,
      stability: analysis.userExperience.stability,
      efficiency: analysis.userExperience.efficiency,
      recommendations: analysis.recommendations,
      bottlenecks: analysis.criticalPath.bottlenecks,
    },
  };

  // Download as JSON
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  console.log(`Report exported to ${filename}`);
  return report;
}

/**
 * Example 7: Monitor Performance Over Time (Session Storage)
 */
export function example_trackPerformanceTrend(snapshot: BenchmarkSnapshot) {
  const analysis = PerformanceAnalyzer.analyze(snapshot);

  // Load history from session storage
  const history = JSON.parse(sessionStorage.getItem('benchmarkHistory') || '[]');

  // Add current result
  history.push({
    timestamp: new Date().toISOString(),
    score: analysis.userExperience.overall,
    grade: analysis.userExperience.grade,
    eventCount: snapshot.events.length,
    duration: snapshot.endTime - snapshot.startTime,
  });

  // Keep last 10 results
  const recentHistory = history.slice(-10);
  sessionStorage.setItem('benchmarkHistory', JSON.stringify(recentHistory));

  // Show trend
  console.log('PERFORMANCE TREND (Last 10 Runs)');
  console.log('==================================\n');

  recentHistory.forEach((item: any, i: number) => {
    console.log(`${i + 1}. [${item.grade}] Score: ${item.score}/100 | Events: ${item.eventCount} | Duration: ${(item.duration / 1000).toFixed(2)}s`);
  });

  // Calculate trend
  if (recentHistory.length > 1) {
    const firstScore = recentHistory[0].score;
    const lastScore = recentHistory[recentHistory.length - 1].score;
    const trend = lastScore - firstScore;
    const direction = trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '→ Stable';

    console.log(`\n${direction} (${trend > 0 ? '+' : ''}${trend} points)`);
  }

  return recentHistory;
}

/**
 * Example 8: Real-time Performance Monitoring Hook
 * Use in React components
 */
export function usePerformanceBenchmark() {
  const harnessRef = React.useRef<BenchmarkHarness | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [snapshot, setSnapshot] = React.useState<BenchmarkSnapshot | null>(null);

  const startBenchmark = React.useCallback(() => {
    if (!harnessRef.current) {
      harnessRef.current = new BenchmarkHarness();
    }
    harnessRef.current.start();
    setIsRecording(true);
  }, []);

  const stopBenchmark = React.useCallback(() => {
    if (harnessRef.current) {
      const result = harnessRef.current.stop();
      setSnapshot(result);
      setIsRecording(false);

      // Auto-analyze
      const analysis = PerformanceAnalyzer.analyze(result);
      console.log(`Performance Grade: ${analysis.userExperience.grade}`);
    }
  }, []);

  return {
    isRecording,
    snapshot,
    startBenchmark,
    stopBenchmark,
    analysis: snapshot ? PerformanceAnalyzer.analyze(snapshot) : null,
  };
}

/**
 * Example 9: Browser Console Quick Commands
 * Paste these directly into DevTools console
 */
export const consoleQuickStart = `
// Quick start in browser console:

// 1. Start recording
const harness = new (require('/lib/benchmark').BenchmarkHarness)();
harness.start();
console.log('Recording started... interact with the page, then run step 2');

// 2. Stop and analyze
const snapshot = harness.stop();
const analysis = (require('/lib/benchmark').PerformanceAnalyzer).analyze(snapshot);
console.log(JSON.stringify({
  score: analysis.userExperience.overall,
  grade: analysis.userExperience.grade,
  events: snapshot.events.length,
  duration: (snapshot.endTime - snapshot.startTime).toFixed(0) + 'ms'
}, null, 2));

// 3. See recommendations
analysis.recommendations.forEach(r => console.log(\`[\${r.priority}] \${r.title}\`));

// 4. Export
JSON.stringify(snapshot, null, 2) // copy and save as JSON
`;

/**
 * Example 10: Testing Helper - Assert Performance Goals
 */
export function example_assertPerformanceGoals(snapshot: BenchmarkSnapshot) {
  const analysis = PerformanceAnalyzer.analyze(snapshot);
  const errors: string[] = [];

  // Assert minimum grade
  if (analysis.userExperience.grade < 'B') {
    errors.push(`Performance grade ${analysis.userExperience.grade} is below target B`);
  }

  // Assert responsiveness
  if (analysis.userExperience.responsiveness < 80) {
    errors.push(`Responsiveness ${analysis.userExperience.responsiveness}/100 is below target 80`);
  }

  // Assert event count
  if (snapshot.events.length > 100) {
    errors.push(`Event count ${snapshot.events.length} exceeds target 100`);
  }

  // Assert bottlenecks
  if (analysis.criticalPath.bottlenecks.length > 5) {
    errors.push(`Bottleneck count ${analysis.criticalPath.bottlenecks.length} exceeds target 5`);
  }

  if (errors.length > 0) {
    console.error('Performance Assertions Failed:');
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    throw new Error('Performance goals not met');
  } else {
    console.log('✓ All performance goals met');
  }

  return true;
}
