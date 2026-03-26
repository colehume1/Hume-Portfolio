import express, { type Request, Response } from "express";
import { type IncomingMessage, type ServerResponse } from "http";
import { registerRoutes } from "../server/routes";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(
  express.json({
    verify: (req: IncomingMessage, _res: ServerResponse, buf: Buffer) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

let routesRegistered = false;

async function initApp() {
  if (!routesRegistered) {
    await registerRoutes(null as any, app);
    routesRegistered = true;
  }
}

export default async function handler(req: Request, res: Response) {
  await initApp();
  app(req, res);
}
