# Performance Benchmark Harness

A comprehensive benchmarking system for measuring and analyzing e-commerce application performance across user journeys.

## Features

- **EventRecorder**: Captures all user interactions (clicks, navigations, inputs, scrolls)
- **MetricsCollector**: Measures Core Web Vitals (LCP, FCP, CLS, FID, TTFB)
- **Memory Profiling**: Tracks JS heap usage throughout the user journey
- **EventReplayer**: Reproduces recorded events for consistency validation
- **PerformanceAnalyzer**: Advanced analysis with scoring and recommendations
- **BenchmarkOverlay**: Optional UI component for manual benchmarking

## Architecture

```
┌─────────────────────────────────┐
│   BenchmarkHarness              │
├─────────────────────────────────┤
│ ├─ EventRecorder                │
│ │  └─ Captures all interactions │
│ ├─ MetricsCollector             │
│ │  └─ Web Vitals & Memory       │
│ └─ Snapshot Management          │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│   Analysis & Reporting          │
├─────────────────────────────────┤
│ ├─ EventReplayer                │
│ │  └─ Timing validation         │
│ ├─ TimingAnalyzer               │
│ │  └─ Event patterns            │
│ └─ PerformanceAnalyzer          │
│    └─ Scoring & recommendations │
└─────────────────────────────────┘
```

## Usage

### Manual Benchmarking (Browser)

Add the BenchmarkOverlay component to your layout:

```tsx
import { BenchmarkOverlay } from '@/components/benchmark/BenchmarkOverlay';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <BenchmarkOverlay enabled={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}
```

Then:
1. Click "Start" to begin recording
2. Interact with the page
3. Click "Stop" when done
4. Click "Report" to export benchmark data as JSON

### Automated Benchmarking

Run the automated benchmark script:

```bash
npx ts-node scripts/run-benchmark.ts
```

This follows the complete e-commerce user journey:
1. Load home page
2. Wait for featured products
3. Navigate to /productos
4. Apply category filter
5. Apply price sort
6. Open product detail
7. Adjust quantity
8. Add to cart

Output: `security-benchmark-report.json`

### Programmatic Usage

```typescript
import { BenchmarkHarness, PerformanceAnalyzer } from '@/lib/benchmark';

// Create harness
const harness = new BenchmarkHarness();

// Start recording
harness.start();

// ... user interactions ...

// Stop and get snapshot
const snapshot = harness.stop();

// Analyze results
const analysis = PerformanceAnalyzer.analyze(snapshot);

// Print summary
console.log(PerformanceAnalyzer.generateSummary(analysis));
```

## Events Captured

| Event Type | Description | Metadata |
|-----------|-------------|----------|
| `click` | User clicked an element | tagName, id, className, text |
| `navigate` | Page navigation occurred | url |
| `input` | User typed into an input | tagName, id, value |
| `scroll` | Page was scrolled | scrollX, scrollY |
| `resize` | Window was resized | width, height |
| `focus` | Element received focus | tagName, id |
| `blur` | Element lost focus | tagName, id |

## Web Vitals Measured

| Metric | Threshold | What It Measures |
|--------|-----------|-----------------|
| **LCP** | ≤ 2.5s | Largest Contentful Paint |
| **FCP** | ≤ 1.8s | First Contentful Paint |
| **CLS** | ≤ 0.1 | Cumulative Layout Shift |
| **FID** | ≤ 100ms | First Input Delay |
| **TTFB** | ≤ 600ms | Time to First Byte |

## Report Structure

```json
{
  "timestamp": "2026-04-09T...",
  "benchmarkResults": {
    "userJourney": "description",
    "eventCapture": {
      "totalEvents": 42,
      "eventsByType": { "click": 15, "navigate": 3, ... },
      "timing": {
        "averageEventSpacing": 234,
        "maxEventSpacing": 1200,
        "minEventSpacing": 45,
        "eventDensity": 5.2
      },
      "bottlenecks": [...]
    },
    "webVitals": {
      "LCP": "2150ms",
      "FCP": "850ms",
      "CLS": "0.05",
      "FID": "85ms",
      "TTFB": "320ms"
    },
    "memory": {
      "samples": 42,
      "snapshots": [...]
    },
    "bottlenecks": [
      {
        "type": "navigate",
        "timestamp": "2345ms",
        "description": "Large gap from previous event"
      }
    ],
    "opportunities": [...]
  }
}
```

## Performance Analysis

The PerformanceAnalyzer provides:

1. **Event Metrics**: Event distribution, clustering patterns, critical events
2. **Critical Path**: Essential user journey steps and delays
3. **User Experience Score**:
   - Overall: 0-100
   - Responsiveness: Based on LCP, FCP, FID
   - Stability: Based on CLS
   - Efficiency: Based on event density and memory
4. **Recommendations**: Prioritized, actionable improvements

## Scoring Grades

| Grade | Score | Rating |
|-------|-------|--------|
| A | 90-100 | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Fair |
| D | 60-69 | Poor |
| F | 0-59 | Critical |

## Limitations

- Click event replication may fail if selectors don't match
- Memory measurements require browser with `performance.memory` API
- Some performance metrics (like real FID) require actual user input
- PerformanceObserver support varies by browser

## Files

| File | Purpose |
|------|---------|
| `harness.ts` | Core EventRecorder and MetricsCollector |
| `replay.ts` | EventReplayer and TimingAnalyzer |
| `analyzer.ts` | PerformanceAnalyzer with scoring |
| `index.ts` | Public API exports |
| `../components/benchmark/BenchmarkOverlay.tsx` | UI component |
| `../scripts/run-benchmark.ts` | Automated benchmark script |

## Notes

- The harness does NOT modify application files
- All recording happens in-memory; no server uploads by default
- Reports can be exported as JSON and committed to version control
- Use for regression testing, performance baselines, and optimization validation
