import type { AnkiNote } from "#/types";
import WorkerMain$ from "#/worker/workerMain?worker";
import type { QueryRequest, QueryResponse } from "./workerMain";

export class WorkerMain {
  private worker: Worker;

  constructor() {
    this.worker = new WorkerMain$();
  }

  /**
   * Query notes that contain any of the provided kanji.
   */
  query(
    kanjiList: string[],
    onProgress?: (info: { chunk: string; found: number }) => void,
  ): Promise<{
    totalFound: number;
    notes: AnkiNote[];
  }> {
    return new Promise((resolve, reject) => {
      const handleMessage = (e: MessageEvent<QueryResponse>) => {
        const msg = e.data;
        switch (msg.type) {
          case "progress":
            onProgress?.({ chunk: msg.chunk, found: msg.found });
            break;
          case "success":
            this.worker.removeEventListener("message", handleMessage);
            resolve({ totalFound: msg.totalFound, notes: msg.notes });
            break;
          case "error":
            this.worker.removeEventListener("message", handleMessage);
            reject(new Error(msg.error));
            break;
        }
      };

      this.worker.addEventListener("message", handleMessage);

      const message: QueryRequest = { type: "query", kanjiList };
      this.worker.postMessage(message);
    });
  }

  /**
   * Terminate the worker to free memory.
   */
  terminate() {
    this.worker.terminate();
  }
}

export const worker = new WorkerMain();
