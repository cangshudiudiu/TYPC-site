import { copyFile, mkdir } from "node:fs/promises";

const workerDir = new URL("../dist/_worker.js/", import.meta.url);
const workerFile = new URL("index.js", workerDir);
const workerSource = new URL("../src/worker/index.js", import.meta.url);

await mkdir(workerDir, { recursive: true });
await copyFile(workerSource, workerFile);
