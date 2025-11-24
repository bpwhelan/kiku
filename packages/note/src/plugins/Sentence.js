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
      const translation = document.getElementById(
        "SentenceTranslation",
      )?.innerText;
      if (!translation) return null;
      return h(
        "div",
        {
          class: "text-lg text-base-content-calm",
        },
        translation,
      )();
    }

    return [props.DefaultSentence(), SentenceTranslation()];
  },
};
