const ANALYTICS_ENDPOINT = import.meta.env.VITE_ANALYTICS_ENDPOINT;

const sendMetric = (metric) => {
  if (!ANALYTICS_ENDPOINT || typeof navigator === 'undefined') return;

  const payload = JSON.stringify({
    app: 'ntuma-web',
    path: window.location.pathname,
    metric,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, payload);
    return;
  }

  fetch(ANALYTICS_ENDPOINT, {
    method: 'POST',
    body: payload,
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  }).catch(() => {});
};

const observeMetric = (type, mapEntry) => {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => sendMetric(mapEntry(entry)));
    });
    observer.observe({ type, buffered: true });
  } catch {
    // Some browsers do not support every performance entry type.
  }
};

export const startPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  observeMetric('largest-contentful-paint', (entry) => ({
    name: 'LCP',
    value: Math.round(entry.startTime),
    unit: 'ms',
  }));

  observeMetric('layout-shift', (entry) => ({
    name: 'CLS',
    value: Number(entry.value.toFixed(4)),
    unit: 'score',
  }));

  observeMetric('event', (entry) => ({
    name: 'INP',
    value: Math.round(entry.duration),
    unit: 'ms',
  }));

  window.addEventListener('load', () => {
    const [navigation] = performance.getEntriesByType('navigation');
    if (!navigation) return;

    sendMetric({
      name: 'TTFB',
      value: Math.round(navigation.responseStart),
      unit: 'ms',
    });
  });
};
