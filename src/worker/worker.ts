import type { AnkiNote, KikuNotesManifest } from "#/types";
import { env } from "#/util/general";

export type WorkerChannels = {
  query: {
    payload: string[];
    result: AnkiNote[];
  };
  querySharedAndSimilar: {
    payload: string[];
    result: Record<string, { shared: AnkiNote[]; similar: AnkiNote[] }>;
  };
  getSimilarKanji: {
    payload: string;
    result: string[];
  };
};
export type Key = keyof WorkerChannels;
export type WorkerResponse<T extends Key> =
  | { type: T; result: WorkerChannels[T]["result"]; error: null }
  | { type: T; result: null; error: string };
export type WorkerRequest<T extends Key> = {
  type: T;
  payload: WorkerChannels[T]["payload"];
};
type WorkerMethod = (
  payload: WorkerChannels[Key]["payload"],
) => Promise<WorkerChannels[Key]["result"]>;

class AppWorker {
  constructor() {
    AppWorker.manifest = fetch(`/${env.KIKU_NOTES_MANIFEST}`).then((res) =>
      res.json(),
    );

    self.onmessage = async (e: MessageEvent<WorkerRequest<Key>>) => {
      const method = AppWorker[e.data.type] as WorkerMethod;
      method(e.data.payload)
        .then((result) => {
          AppWorker.postMessage({
            type: e.data.type,
            result,
            error: null,
          });
        })
        .catch((err) => {
          AppWorker.postMessage({
            type: e.data.type,
            result: null,
            error: (err as Error).message,
          });
        });
    };
  }

  static getSimilarKanji(kanji: string) {
    const store: Record<string, { kanji: string; score: number }> = {};
    const sources = AppWorker.similar_kanji_sources;

    sources.forEach((source) => {
      const db = AppWorker.dbCache[source.file];
      if (!db || !(kanji in db)) return;

      db[kanji].forEach((similarity_info: any) => {
        const isObject =
          typeof similarity_info !== "string" && "kan" in similarity_info;
        const similar_kanji = isObject ? similarity_info.kan : similarity_info;
        const score =
          source.base_score + (isObject ? (similarity_info.score ?? 0) : 0);

        // optionally check if score passes threshold
        const oldScore = store[similar_kanji]?.score ?? 0;
        if (
          score > AppWorker.similar_kanji_min_score ||
          (score > 0 && oldScore > 0)
        ) {
          store[similar_kanji] = { kanji: similar_kanji, score };
        } else if (score < 0) {
          delete store[similar_kanji];
        }
      });
    });

    return Object.keys(store);
  }

  static async query(kanjiList: string[]) {
    const result: AnkiNote[] = [];
    const manifest = await AppWorker.manifest;

    for (const chunk of manifest.chunks) {
      const res = await fetch(`/${chunk.file}`);
      if (!res.body) throw new Error(`No body for ${chunk.file}`);

      const ds = new DecompressionStream("gzip");
      const decompressed = res.body.pipeThrough(ds);
      const text = await new Response(decompressed).text();
      const notes = JSON.parse(text) as AnkiNote[];

      const matches = notes.filter(
        (note) =>
          (note.modelName === "Kiku" || note.modelName === "Lapis") &&
          Array.from(kanjiList).some((kanji) =>
            note.fields.Expression.value.includes(kanji),
          ),
      );

      if (matches.length > 0) result.push(...matches);
    }
    return result;
  }

  static async querySharedAndSimilar(kanjiList: string[]) {
    const result = await AppWorker.query(kanjiList);
    console.log("✅ Total found:", result.length);
    const kanji = result.reduce(
      (acc, note) => {
        kanjiList.forEach((k) => {
          if (!acc[k]) acc[k] = { shared: [], similar: [] };
          if (note.fields.Expression.value.includes(k))
            acc[k].shared.push(note);
        });
        return acc;
      },
      {} as Record<string, { shared: AnkiNote[]; similar: AnkiNote[] }>,
    );
    Object.keys(kanji).forEach((k) => {
      if (kanji[k].shared.length === 0 && kanji[k].similar.length === 0) {
        delete kanji[k];
      }
    });
    return kanji;
  }

  static similar_kanji_min_score = 0.3;
  static manifest: Promise<KikuNotesManifest>;

  static similar_kanji_sources = [
    { file: `/${env.KIKU_DB_SIMILAR_KANJI_FROM_KEISEI}`, base_score: 0.65 },
    { file: `/${env.KIKU_DB_SIMILAR_KANJI_MANUAL}`, base_score: 0.9 },
    { file: `/${env.KIKU_DB_SIMILAR_KANJI_WK_NIAI_NOTO}`, base_score: 0.1 },
  ];

  static alternative_similar_kanji_sources = [
    { file: `/${env.KIKU_DB_SIMILAR_KANJI_OLD_SCRIPT}`, base_score: 0.4 },
    {
      file: `/${env.KIKU_DB_SIMILAR_KANJI_STROKE_EDIT_DIST}`,
      base_score: -0.2,
    },
    { file: `/${env.KIKU_DB_SIMILAR_KANJI_YL_RADICAL}`, base_score: -0.2 },
  ];

  static dbCache: Record<string, Record<string, any>> = {};

  static async loadSimilarKanjiDBs() {
    const allSources = [
      ...AppWorker.similar_kanji_sources,
      // ...WorkerMain.alternative_similar_kanji_sources,
    ];
    for (const src of allSources) {
      if (!AppWorker.dbCache[src.file]) {
        const res = await fetch(src.file);
        if (!res.ok) throw new Error(`Failed to load ${src.file}`);
        AppWorker.dbCache[src.file] = await res.json();
      }
    }
  }

  static postMessage(msg: WorkerResponse<Key>) {
    self.postMessage(msg);
  }
}

new AppWorker();
