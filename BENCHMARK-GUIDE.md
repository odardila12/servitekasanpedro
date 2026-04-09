# Performance Benchmark System - Complete Guide

## Overview

A production-ready performance benchmarking harness for the Serviteka e-commerce application. Captures user interactions, Core Web Vitals, memory usage, and generates detailed performance analysis with actionable recommendations.

## Quick Start

### 1. Manual Benchmarking (Browser UI)

Add to `app/layout.tsx`:

```tsx
import { BenchmarkOverlay } from '@/components/benchmark/BenchmarkOverlay';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <BenchmarkOverlay enabled={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}
```

Then in browser:
1. Click "Start Recording" button (bottom-right)
2. Interact with the app (navigate, filter, search, add to cart)
3. Click "Stop" when done
4. Click "Report" to download `benchmark-report-{timestamp}.json`
5. Report also available in browser console as `window.__benchmarkReport`

### 2. Automated Benchmarking (CLI)

```bash
# Ensure dev server is running on http://localhost:3000
npm run dev

# In another terminal:
npx ts-node scripts/run-benchmark.ts
```

Output: `security-benchmark-report.json` (auto-generated in project root)

## Benchmark User Journey

The automated script follows this exact path:

1. **Load Home Page** (`GET /`)
   - Captures initial navigation timing
   - Waits for featured products section

2. **Featured Products Load**
   - Measures when product cards become visible
   - Records LCP, FCP metrics

3. **Navigate to Productos** (`GET /productos`)
   - Click navigation or direct route
   - Wait for product list to render

4. **Apply Category Filter**
   - Interact with category dropdown/select
   - Select first category option
   - Record filtering performance

5. **Apply Price Sort**
   - Click sort dropdown
   - Apply price sort option
   - Measure sort operation timing

6. **Open Product Detail** (`GET /productos/[id]`)
   - Click first product
   - Wait for detail page load
   - Measure detail page rendering

7. **Adjust Quantity & Add to Cart**
   - Input quantity (2)
   - Click "Agregar" button
   - Record add-to-cart interaction

## Output Report Structure

### JSON Report (`security-benchmark-report.json`)

```json
{
  "timestamp": "2026-04-09T13:45:23.123Z",
  "benchmarkResults": {
    "userJourney": "Complete journey description",
    "eventCapture": {
      "totalEvents": 42,
      "events": [
        {
          "type": "click",
          "timestamp": 234,
          "url": "http://localhost:3000/productos",
          "metadata": {
            "tagName": "BUTTON",
            "id": "add-to-cart",
            "className": "btn-primary"
          }
        }
      ],
      "timing": {
        "totalDuration": 28500,
        "averageEventSpacing": 234,
        "maxEventSpacing": 2100,
        "minEventSpacing": 45,
        "eventDensity": 5.2
      },
      "bottlenecks": [
        {
          "type": "navigate",
          "timestamp": "2345ms",
          "description": "Large gap of 2100ms from previous event"
        }
      ]
    },
    "webVitals": {
      "TTFB": "320ms",
      "navigationStart": 1680000000000,
      "responseStart": 1680000000320,
      "domContentLoaded": 1850,
      "loadComplete": 2450
    },
    "memory": {
      "samples": 1,
      "initial": {
        "heap": "45.23MB",
        "limit": "2048.00MB"
      },
      "final": {
        "heap": "52.18MB",
        "limit": "2048.00MB"
      }
    },
    "bottlenecks": [
      {
        "type": "navigate",
        "timestamp": "5234ms",
        "description": "Large gap from previous event"
      }
    ],
    "opportunities": [
      "Completed benchmark with 42 events over 28.50s",
      "Average event spacing: 234ms",
      "Consider reducing HTTP requests through bundling",
      "Investigate 3 bottlenecks with >2s gaps"
    ],
    "summary": {
      "totalDuration": "28.50s",
      "totalEvents": 42,
      "status": "COMPLETE",
      "pages": [
        "http://localhost:3000",
        "http://localhost:3000/productos",
        "http://localhost:3000/productos/[id]"
      ]
    }
  }
}
```

## Event Types Captured

| Type | When | Metadata |
|------|------|----------|
| `click` | Element clicked | tagName, id, className, text content |
| `navigate` | URL changed | new URL |
| `input` | User typed | field id, value (truncated) |
| `scroll` | Page scrolled | scrollX, scrollY |
| `resize` | Window resized | new width, height |
| `focus` | Element focused | tagName, id |
| `blur` | Element blurred | tagName, id |

## Core Web Vitals

### Measured Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| **LCP** | ≤ 2.5s | Largest Contentful Paint (image/text) |
| **FCP** | ≤ 1.8s | First paint of any content |
| **CLS** | ≤ 0.1 | Layout shift without user input |
| **FID** | ≤ 100ms | Delay before responding to input |
| **TTFB** | ≤ 600ms | Time to first byte from server |

### What They Mean

- **LCP**: How long until main content appears
  - Slow = images loading late, render-blocking JS
  - Fix: Optimize images, defer non-critical scripts

- **FCP**: How long until any content appears
  - Slow = CSS/fonts block rendering
  - Fix: Inline critical CSS, self-host fonts

- **CLS**: Unexpected layout shifts during load
  - High = missing size attributes, late-loaded ads
  - Fix: Set width/height on dynamic content

## Analyzing Results

### Using the PerformanceAnalyzer

```typescript
import { BenchmarkHarness, PerformanceAnalyzer } from '@/lib/benchmark';

// Load snapshot from JSON
const json = require('./security-benchmark-report.json');
const snapshot = json.benchmarkResults;

// Analyze
const analysis = PerformanceAnalyzer.analyze(snapshot);

// View summary
console.log(PerformanceAnalyzer.generateSummary(analysis));

// Access detailed results
console.log(analysis.userExperience.grade); // A, B, C, D, or F
console.log(analysis.recommendations); // Prioritized actions
```

### Scoring System

**Overall Score**: 0-100 based on three factors:

1. **Responsiveness** (30%): LCP, FCP, FID
   - Grade A: ≤100ms LCP, ≤1s FCP
   - Grade F: >2.5s LCP, >1.8s FCP

2. **Stability** (30%): Layout Shift (CLS)
   - Grade A: ≤0.05 CLS
   - Grade F: >0.2 CLS

3. **Efficiency** (30%): Event density, memory, clustering
   - Grade A: <5 events/sec, <50MB heap
   - Grade F: >20 events/sec, >100MB heap

**Final Grade**:
- A: 90-100 (Excellent)
- B: 80-89 (Good)
- C: 70-79 (Fair)
- D: 60-69 (Poor)
- F: 0-59 (Critical)

## Use Cases

### 1. Regression Testing

Compare reports before/after changes:

```bash
# Before optimization
npx ts-node scripts/run-benchmark.ts > before.json

# After optimization
npx ts-node scripts/run-benchmark.ts > after.json

# Compare
diff before.json after.json
```

### 2. Performance Baselines

Save reports to track performance over time:

```bash
# Daily benchmarks
0 9 * * * cd /path/to/project && npx ts-node scripts/run-benchmark.ts
```

### 3. CI/CD Integration

```yaml
# .github/workflows/benchmark.yml
name: Performance Benchmark

on: [push]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run dev &
      - run: npx ts-node scripts/run-benchmark.ts
      - uses: actions/upload-artifact@v3
        with:
          name: benchmark-report
          path: security-benchmark-report.json
```

### 4. Performance Debugging

Identify slow operations:

```typescript
const analysis = PerformanceAnalyzer.analyze(snapshot);

// Find critical bottlenecks
analysis.criticalPath.bottlenecks.forEach(bottleneck => {
  console.log(`${bottleneck.event.type}: ${bottleneck.duration}ms`);
});

// View all recommendations
analysis.recommendations.forEach(rec => {
  console.log(`[${rec.priority}] ${rec.title}: ${rec.description}`);
});
```

## Architecture Details

### EventRecorder

```typescript
class EventRecorder {
  start(): void                    // Begin capturing
  stop(): BenchmarkEvent[]         // End and return events
  attachListeners(): void          // Setup DOM listeners
  detachListeners(): void          // Cleanup
  private recordEvent(...)          // Internal recording
}
```

**Features**:
- Captures clicks, navigations, inputs, scrolls, resizes, focus/blur
- Timestamp relative to recorder start
- Element metadata (id, class, tag, text)
- URL tracking for each event

### MetricsCollector

```typescript
class MetricsCollector {
  start(): void                    // Begin measuring
  stop(): void                     // End measurement
  getMetrics(): WebVitalMetrics    // Get collected metrics
  getMemorySnapshots(): MemorySnapshot[]
}
```

**Features**:
- PerformanceObserver for LCP, FCP, CLS, FID
- Navigation Timing API for TTFB
- Memory sampling every 500ms
- Fallback handling for unsupported APIs

### EventReplayer

```typescript
class EventReplayer {
  async replay(): Promise<ReplayReport>
  private async replayEvent(event)
  getTimingValidation(): TimingValidationResult[]
}
```

**Features**:
- Reproduces events in order
- Speed multiplier (1x, 2x, etc.)
- Timing variance tracking
- Event-type-specific replay logic

### PerformanceAnalyzer

```typescript
class PerformanceAnalyzer {
  static analyze(snapshot): PerformanceAnalysis
  static generateSummary(analysis): string
}
```

**Analysis Includes**:
- Event clustering and patterns
- Critical path identification
- User experience scoring
- Prioritized recommendations

## File Structure

```
lib/
  benchmark/
    harness.ts          # EventRecorder, MetricsCollector, BenchmarkHarness
    replay.ts           # EventReplayer, TimingAnalyzer
    analyzer.ts         # PerformanceAnalyzer, detailed analysis
    index.ts            # Public API
    README.md           # Technical docs

components/
  benchmark/
    BenchmarkOverlay.tsx # Manual benchmarking UI

scripts/
  run-benchmark.ts      # Automated user journey

BENCHMARK-GUIDE.md      # This file
security-benchmark-report.json # Generated report
```

## Limitations & Notes

### Browser Support
- PerformanceObserver: Chrome 52+, Firefox 57+, Safari 14.1+
- Memory API: Chrome/Edge only, not in Firefox/Safari
- Custom events always captured regardless of browser

### Accuracy Considerations
- Replayed events may not match exactly (selectors, dynamic content)
- Memory measurements fluctuate due to GC
- FID in real browser vs simulated differs
- Network timing varies based on connection

### Performance Impact
- EventRecorder adds minimal overhead (~2ms per event)
- MetricsCollector: ~500 bytes per second (memory sampling)
- PerformanceObserver: Native browser API, negligible cost
- Safe to run in production (can disable with flag)

## Troubleshooting

### Metrics Not Captured
- Ensure site is served over HTTPS (LCP requires PerformanceObserver)
- Check browser DevTools > Performance tab for metrics
- Some metrics require user interaction or specific content types

### Script Not Finding Elements
- Update selectors in `run-benchmark.ts`
- Use more specific CSS selectors for dynamic content
- Add `data-testid` attributes to important elements

### Memory Spikes
- Normal for large product lists
- Check for event listener leaks
- Profile with DevTools Memory tab

## Best Practices

1. **Run Multiple Times**: Performance varies, take average of 3+ runs
2. **Clean Slate**: Clear cache/cookies before benchmarking
3. **Consistent Network**: Use throttling (DevTools: 4G)
4. **Same Device**: Hardware significantly impacts results
5. **Same Time**: Run at consistent times to avoid system load variance
6. **Monitor Trends**: Track over time, focus on patterns not single runs

## Next Steps

1. Add to your development setup: `npm run dev + BenchmarkOverlay`
2. Run automated benchmark: `npx ts-node scripts/run-benchmark.ts`
3. Analyze results: Review report and recommendations
4. Implement quick wins: Address low-hanging fruit
5. Track over time: Save reports, compare trends
6. CI Integration: Add to GitHub Actions for regression detection

## Questions?

See `lib/benchmark/README.md` for technical details or review source files:
- `lib/benchmark/harness.ts` - Event capture & metrics
- `lib/benchmark/replay.ts` - Event replay logic
- `lib/benchmark/analyzer.ts` - Analysis algorithms
