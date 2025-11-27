import client from "prom-client";

client.collectDefaultMetrics();

export const register = client.register;

// Counter
export const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"]
});

// Gauge
export const activeRequests = new client.Gauge({
  name: "active_http_requests",
  help: "Current number of active HTTP requests"
});

// Histogram
export const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2]
});
