/**
 * @import { KikuPlugin } from "#/plugins/pluginTypes";
 */

/**
 * @type { KikuPlugin }
 */
export const plugin = {
  Sentence: (props) => {
    const h = props.ctx.h;

    function SentenceTranslation() {
      const translation =
        //@ts-expect-error we have extra fields
        props.ctx.ankiFields?.SentenceTranslation ||
        document.getElementById("SentenceTranslation")?.innerHTML;
      if (!translation) return null;
      return h("div", {
        class: "text-lg text-base-content-calm",
        innerHTML: translation,
      })();
    }

    return [props.DefaultSentence(), SentenceTranslation()];
  },
};
