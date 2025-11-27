# Prometheus And  Grafana
To run

```bash
docker-compose up --build
```

![alt text](image.png)


**Prometheus queries (PromQL)**


## **1️⃣ Total Requests (Counter)**

```promql
sum(rate(http_requests_total[1m]))
```

* Shows **requests per second** over the last 1 minute
* `sum` combines all routes, methods, and statuses
* `rate` converts a cumulative counter to per-second rate

**Example:** For TPS (transactions per second) graph


## **2️⃣ Requests per Route (Counter)**

```promql
sum by (route) (rate(http_requests_total[1m]))
```

* Shows request rate **grouped by route**
* Useful to see which endpoint is most used


## **3️⃣ Requests per Status Code (Counter)**

```promql
sum by (status) (rate(http_requests_total[1m]))
```

* Shows number of requests **per status code** (200, 404, 500)
* Good for monitoring error spikes


## **4️⃣ Active Requests (Gauge)**

```promql
active_http_requests
```

* Current number of active requests
* Gauge goes up/down automatically


## **5️⃣ Request Latency (Histogram)**

**P50 (50th percentile latency)**

```promql
histogram_quantile(0.50, sum(rate
(http_request_duration_seconds_bucket[1m])) by (le))
```

**P90 (90th percentile latency)**

```promql
histogram_quantile(0.90, sum(rate
(http_request_duration_seconds_bucket[1m])) by (le))
```

**P95 / P99** just change `0.90 → 0.95` or `0.99`

* `histogram_quantile` calculates latency percentiles
* Shows **response time trends**


## **6️⃣ Average Request Duration**

```promql
sum(rate(http_request_duration_seconds_sum[1m])) / 
sum(rate(http_request_duration_seconds_count[1m]))
```

* Uses histogram `_sum` / `_count`
* Gives **average latency in seconds**


## **7️⃣ Error Rate (% of 5xx requests)**

```promql
sum by (status)(rate(http_requests_total{status=~"5.."}[1m])) 
/ 
sum(rate(http_requests_total[1m]))
```

* Shows proportion of **server errors**
* Useful for alerting


## **8️⃣ Requests per Method (GET/POST)**

```promql
sum by (method) (rate(http_requests_total[1m]))
```

* Compare usage of different HTTP methods


## **9️⃣ Requests over time (for Grafana)**

```promql
rate(http_requests_total[5m])
```

* Shows **smoothed request rate** over 5 minutes
* Better for dashboards


## **10️⃣ Custom: Slow Requests (>500ms)**

```promql
sum(rate(http_request_duration_seconds_bucket{le="0.5"}[1m]))
```

* Count of requests **under 500ms**
* You can subtract from total to get requests **>500ms**


