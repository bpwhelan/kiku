---
outline: deep
---

# Plugin

A Kiku plugin is a JavaScript module named `_kiku_plugin.js`.
This module must export a named variable called `plugin`.
The type definitions for this module are available [here](https://github.com/youyoumu/kiku/blob/main/packages/note/src/plugins/pluginTypes.ts).

The plugin system is currently very basic, but more APIs will be added in the future.

## ExternalLinks

If defined, this component will be mounted under the **Definition** section on the back side of the note, replacing the default `ExternalLinks`.

```js
/**
 * @import { KikuPlugin } from "#/plugins/pluginTypes";
 */

/**
 * @type { KikuPlugin }
 */
export const plugin = {
  ExternalLinks: (props) => {
    const h = props.ctx.h;

    // Create an arbitrary link
    const NadeshikoLink = h(
      "a",
      {
        href: (() => {
          const url = new URL("https://nadeshiko.co/search/sentence");
          url.searchParams.set("query", props.ctx.ankiFields.Expression);
          return url.toString();
        })(),
        target: "_blank",
      },
      h("img", {
        class: "size-5 object-contain rounded-xs",
        src: "https://nadeshiko.co/favicon.ico",
      }),
    );

    // Create an arbitrary button with a custom on:click handler
    const AnkiDroidBrowseButton = h(
      "button",
      {
        class: "text-sm btn btn-sm",
        "on:click": () => {
          props.ctx
            .ankiDroidAPI()
            ?.ankiSearchCard(
              `("note:Kiku" OR "note:Lapis") AND "Expression:*${props.ctx.ankiFields.Expression}*"`,
            );
        },
      },
      "Browse",
    );

    return [
      // includes the default ExternalLinks
      props.DefaultExternalLinks(),
      NadeshikoLink(),
      AnkiDroidBrowseButton(),
    ];
  },
};
```

## Sentence

If defined, this component will replace the default `Sentence` component.

```js
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
```
