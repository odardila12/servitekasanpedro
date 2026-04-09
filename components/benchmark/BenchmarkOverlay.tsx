'use client';

import React, { useState, useRef } from 'react';
import { BenchmarkHarness, BenchmarkSnapshot } from '@/lib/benchmark/harness';
import { EventReplayer, TimingAnalyzer } from '@/lib/benchmark/replay';

export interface BenchmarkOverlayProps {
  enabled?: boolean;
}

export const BenchmarkOverlay: React.FC<BenchmarkOverlayProps> = ({ enabled = true }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [eventCount, setEventCount] = useState(0);
  const [snapshot, setSnapshot] = useState<BenchmarkSnapshot | null>(null);
  const harnessRef = useRef<BenchmarkHarness | null>(null);

  if (!enabled) return null;

  const startRecording = () => {
    if (!harnessRef.current) {
      harnessRef.current = new BenchmarkHarness();
    }
    harnessRef.current.start();
    setIsRecording(true);
    setEventCount(0);

    // Update event count every 500ms
    const interval = setInterval(() => {
      const current = harnessRef.current?.getSnapshot();
      if (current) {
        setEventCount(current.events.length);
      }
    }, 500);

    // Store interval ID for cleanup
    if (!harnessRef.current) {
      harnessRef.current = new BenchmarkHarness();
    }
    (harnessRef.current as any).__updateInterval = interval;
  };

  const stopRecording = () => {
    if (!harnessRef.current) return;

    clearInterval((harnessRef.current as any).__updateInterval);
    const result = harnessRef.current.stop();
    setSnapshot(result);
    setIsRecording(false);
  };

  const generateReport = async () => {
    if (!snapshot) return;

    const timing = TimingAnalyzer.analyzeEventTimings(snapshot.events);
    const bottlenecks = TimingAnalyzer.identifyBottlenecks(snapshot.events);
    const eventsByType = TimingAnalyzer.groupEventsByType(snapshot.events);

    // Generate performance opportunities
    const opportunities: string[] = [];

    if (snapshot.metrics.LCP && snapshot.metrics.LCP > 2500) {
      opportunities.push('LCP is slow (> 2.5s). Consider optimizing image loading and critical resources.');
    }
    if (snapshot.metrics.FCP && snapshot.metrics.FCP > 1800) {
      opportunities.push('FCP is slow (> 1.8s). Consider reducing render-blocking resources.');
    }
    if (snapshot.metrics.CLS && snapshot.metrics.CLS > 0.1) {
      opportunities.push('CLS is high (> 0.1). Consider adding size constraints to dynamic content.');
    }
    if (timing.eventDensity > 10) {
      opportunities.push('High event density detected. Consider debouncing event handlers.');
    }
    if (bottlenecks.length > 5) {
      opportunities.push(`${bottlenecks.length} bottlenecks detected (>500ms gaps). Check for long tasks.`);
    }

    const memorySnapshots = snapshot.memory || [];
    if (memorySnapshots.length > 0) {
      const lastMemory = memorySnapshots[memorySnapshots.length - 1];
      if (lastMemory.usedJSHeapSize && lastMemory.usedJSHeapSize > 50 * 1024 * 1024) {
        // > 50MB
        opportunities.push('High memory usage detected. Consider profiling for memory leaks.');
      }
    }

    if (Object.keys(eventsByType).length > 0) {
      const mostCommon = Object.entries(eventsByType).sort((a, b) => b[1].length - a[1].length)[0];
      if (mostCommon && mostCommon[1].length > 50) {
        opportunities.push(`High volume of '${mostCommon[0]}' events. Consider batching or throttling.`);
      }
    }

    const report = {
      timestamp: new Date().toISOString(),
      benchmarkResults: {
        userJourney:
          'Complete e-commerce journey: home → products → filter → category → product detail → quantity adjustment',
        eventCapture: {
          totalEvents: snapshot.events.length,
          eventsByType: Object.entries(eventsByType).reduce(
            (acc, [type, events]) => {
              acc[type] = events.length;
              return acc;
            },
            {} as Record<string, number>
          ),
          timing: {
            averageEventSpacing: timing.averageEventSpacing,
            maxEventSpacing: timing.maxEventSpacing,
            minEventSpacing: timing.minEventSpacing,
            eventDensity: timing.eventDensity,
          },
          bottlenecks: bottlenecks.map((event) => ({
            type: event.type,
            timestamp: event.timestamp,
            url: event.url,
            metadata: event.metadata,
          })),
        },
        webVitals: {
          LCP: snapshot.metrics.LCP ? `${snapshot.metrics.LCP}ms` : 'Not captured',
          FID: snapshot.metrics.FID ? `${snapshot.metrics.FID}ms` : 'Not captured',
          CLS: snapshot.metrics.CLS ?? 'Not captured',
          FCP: snapshot.metrics.FCP ? `${snapshot.metrics.FCP}ms` : 'Not captured',
          TTFB: snapshot.metrics.TTFB ? `${snapshot.metrics.TTFB}ms` : 'Not captured',
        },
        memory: {
          samples: memorySnapshots.length,
          snapshots: memorySnapshots.map((s) => ({
            timestamp: s.timestamp,
            usedJSHeapSize: s.usedJSHeapSize ? `${(s.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` : null,
            totalJSHeapSize: s.totalJSHeapSize ? `${(s.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB` : null,
            jsHeapSizeLimit: s.jsHeapSizeLimit ? `${(s.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB` : null,
          })),
        },
        bottlenecks: bottlenecks.map((event) => ({
          type: event.type,
          timestamp: `${event.timestamp.toFixed(0)}ms`,
          description: `${event.type} event with large gap from previous event`,
        })),
        opportunities,
        summary: {
          totalDuration: `${(snapshot.endTime - snapshot.startTime).toFixed(0)}ms`,
          totalEvents: snapshot.events.length,
          averageEventSpacing: `${timing.averageEventSpacing.toFixed(0)}ms`,
          replayable: snapshot.events.filter((e) => ['click', 'navigate', 'input'].includes(e.type)).length,
        },
      },
    };

    // Export as JSON
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `benchmark-report-${Date.now()}.json`;
    link.click();

    // Also save to window for inspection
    (window as any).__benchmarkReport = report;
    console.log('Benchmark Report:', report);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black text-white rounded-lg shadow-2xl p-4 w-80 font-mono text-sm">
      {/* Header */}
      <div className="mb-4 border-b border-gray-700 pb-3">
        <h3 className="font-bold text-base">Performance Benchmark</h3>
        <p className="text-xs text-gray-400">Real-time event capture & metrics</p>
      </div>

      {/* Recording Status */}
      <div className="mb-4 p-2 bg-gray-900 rounded border border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-xs">
            {isRecording ? 'Recording...' : snapshot ? 'Complete' : 'Ready'}
          </span>
        </div>
        <div className="text-lg font-bold text-green-400">{eventCount} events</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRecording ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={generateReport}
          disabled={!snapshot}
          className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition ${
            snapshot
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          Report
        </button>
      </div>

      {/* Quick Metrics Preview */}
      {snapshot && (
        <div className="text-xs space-y-1 p-2 bg-gray-900 rounded border border-gray-700">
          <div>LCP: {snapshot.metrics.LCP ? `${snapshot.metrics.LCP}ms` : '—'}</div>
          <div>FCP: {snapshot.metrics.FCP ? `${snapshot.metrics.FCP}ms` : '—'}</div>
          <div>CLS: {snapshot.metrics.CLS?.toFixed(3) ?? '—'}</div>
          <div>Duration: {((snapshot.endTime - snapshot.startTime) / 1000).toFixed(2)}s</div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
        <p>1. Click "Start" to record</p>
        <p>2. Interact with the page</p>
        <p>3. Click "Stop" when done</p>
        <p>4. Click "Report" to export</p>
      </div>
    </div>
  );
};
