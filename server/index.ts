import express from "express";
import type { Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = process.env.PORT ?? 8000;

app.use(bodyParser.raw({ type: "application/octet-stream" }));

app.get("/", (_, res: Response) => {
  res.send("Server is running...");
});

app.post("/upload", (req: Request, Res: Response) => {});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
