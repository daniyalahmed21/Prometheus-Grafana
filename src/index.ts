import express, { type NextFunction, type Request, type Response } from "express";
import {
  register,
  httpRequests,
  activeRequests,
  httpDuration
} from "./metrics.js";

const app = express();

// Metrics Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  activeRequests.inc();

  const end = httpDuration.startTimer();

  res.on("finish", () => {
    activeRequests.dec();

    const route = req.route ? req.route.path : req.path;

    httpRequests.inc({ method: req.method, route, status: res.statusCode });
    end({ method: req.method, route, status: res.statusCode });
  });

  next();
});

// Sample route
app.get("/", (req: Request, res: Response) => {
  setTimeout(() => {
    res.send("Hello from Bun + Express!");
  }, 150);
});

// Metrics endpoint
app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.listen(3000, () => {
  console.log("🚀 Bun + Express running on http://localhost:3000");
});
