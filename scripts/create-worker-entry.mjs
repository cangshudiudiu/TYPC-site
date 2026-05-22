import { mkdir, writeFile } from "node:fs/promises";

const workerDir = new URL("../dist/_worker.js/", import.meta.url);
const workerFile = new URL("index.js", workerDir);

await mkdir(workerDir, { recursive: true });
await writeFile(
  workerFile,
  `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`
);
