export const debug = {
  printDocument() {
    const root = document.documentElement.outerHTML;
    const shadowRoot =
      document.getElementById("kiku-shadow-parent")?.shadowRoot;
    let shadow = shadowRoot?.getHTML?.();
    //@ts-expect-error // https://issues.chromium.org/issues/41492947
    if (!shadow) shadow = shadowRoot?.getInnerHTML?.();
    return { root, shadow };
  },
  getLogs() {
    const logs = KIKU_STATE.logger.logs;
    const length = logs.length;
    const size =
      logs.reduce((total, str) => total + str.length * 2, 0) + logs.length * 8;

    return { logs, length, size };
  },
  getSessionStorage() {
    const value = Object.fromEntries(
      Object.entries(sessionStorage).map(([key, value]) => [
        key,
        JSON.parse(value),
      ]),
    );
    return value;
  },

  print() {
    const data = {
      document: this.printDocument(),
      logs: this.getLogs(),
      sessionStorage: this.getSessionStorage(),
      timestamp: new Date().toISOString(),
    };

    const text = JSON.stringify(data, null, 2);
    console.log(text);
  },
};

export type Debug = typeof debug;
