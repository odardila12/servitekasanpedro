# Performance Benchmark - Quick Start

## 60-Second Setup

### 1. Manual Benchmarking (Browser)

Add one line to `app/layout.tsx`:

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

**Done!** Benchmark overlay appears bottom-right in dev mode.

### 2. Automated Benchmarking (CLI)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run benchmark (creates security-benchmark-report.json)
npx ts-node scripts/run-benchmark.ts
```

## What Gets Measured

| Metric | What It Measures | Good Value |
|--------|-----------------|-----------|
| **LCP** | Time to largest image/text appears | ≤ 2.5s |
| **FCP** | Time to first paint | ≤ 1.8s |
| **CLS** | Layout shift during load | ≤ 0.1 |
| **FID** | Delay on first interaction | ≤ 100ms |
| **TTFB** | Time from request to first byte | ≤ 600ms |
| **Events** | User interactions captured | Baseline |
| **Memory** | JS heap usage | <50MB |
| **Bottlenecks** | Gaps >1s in interaction | Should be few |

## Reading the Report

Generated JSON includes:

```json
{
  "benchmarkResults": {
    "webVitals": {
      "LCP": "2150ms",      // Time to main content
      "FCP": "850ms",       // Time to any content
      "CLS": "0.05",        // Layout stability (lower is better)
      "TTFB": "320ms"       // Server response time
    },
    "eventCapture": {
      "totalEvents": 42,    // Interactions captured
      "bottlenecks": [...]  // Long waits (>1000ms)
    },
    "opportunities": [      // Actionable improvements
      "Reduce LCP: optimize images...",
      "High memory usage...",
      ...
    ]
  }
}
```

## Usage Examples

### Browser Console (Quick Test)

```javascript
// Start
const h = new BenchmarkHarness(); h.start();

// ... interact with page ...

// Stop and view
const s = h.stop();
console.log(s.metrics);
```

### Programmatic (React Component)

```tsx
import { usePerformanceBenchmark } from '@/lib/benchmark/examples';

export function PerformanceMonitor() {
  const { startBenchmark, stopBenchmark, analysis } = usePerformanceBenchmark();

  return (
    <div>
      <button onClick={startBenchmark}>Start</button>
      <button onClick={stopBenchmark}>Stop</button>
      {analysis && <p>Score: {analysis.userExperience.grade}</p>}
    </div>
  );
}
```

### Full Analysis

```typescript
import { PerformanceAnalyzer } from '@/lib/benchmark';

const snapshot = require('./security-benchmark-report.json');
const analysis = PerformanceAnalyzer.analyze(snapshot.benchmarkResults);

console.log(PerformanceAnalyzer.generateSummary(analysis));
// Prints formatted summary with score, grade, recommendations
```

## Performance Grades

- **A** (90-100): Excellent
- **B** (80-89): Good
- **C** (70-79): Fair
- **D** (60-69): Poor
- **F** (0-59): Critical

Based on three factors:
1. Responsiveness (LCP, FCP, FID)
2. Stability (CLS)
3. Efficiency (memory, event density)

## Key Files

| File | Purpose |
|------|---------|
| `lib/benchmark/harness.ts` | Core event capture & metrics |
| `lib/benchmark/analyzer.ts` | Performance scoring |
| `lib/benchmark/replay.ts` | Event replay & validation |
| `components/benchmark/BenchmarkOverlay.tsx` | Browser UI |
| `scripts/run-benchmark.ts` | Automated journey |
| `BENCHMARK-GUIDE.md` | Full documentation |
| `lib/benchmark/examples.ts` | 10 usage patterns |

## What Gets Recorded

**Events**: clicks, navigations, inputs, scrolls, resizes, focus/blur
**Metrics**: LCP, FCP, CLS, FID, TTFB, memory usage
**Timeline**: precise timestamps for all interactions
**URLs**: page navigation throughout journey

## The Benchmark Journey

Automated script follows this path:
1. Home page load
2. Featured products section
3. Navigate to /productos
4. Apply category filter
5. Apply price sort
6. Open product detail
7. Adjust quantity
8. Add to cart

Full journey: ~30 seconds

## Next Steps

1. **Quick Validation**: Add overlay to layout.tsx, check in browser
2. **First Run**: `npx ts-node scripts/run-benchmark.ts` and review report
3. **Analyze**: Open generated JSON, look for "opportunities" array
4. **Quick Wins**: Address low-hanging fruit (image optimization, lazy loading)
5. **Track**: Save reports, compare before/after changes
6. **CI/CD**: Add to GitHub Actions for regression detection

## Questions

- **"How do I improve LCP?"** → Optimize images, lazy load, defer scripts
- **"What about FID?"** → Reduce JavaScript, break up long tasks
- **"Why is CLS high?"** → Add size constraints, avoid ads in content
- **"How do I set goals?"** → Use assertPerformanceGoals() in examples.ts

See `BENCHMARK-GUIDE.md` for complete documentation.
