import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

app.use(
  express.json({
    verify: (req: any, _res: any, buf: any) => {
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
