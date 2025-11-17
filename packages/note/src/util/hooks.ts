import { createEffect, onMount } from "solid-js";
import { useCardStore } from "#/components/shared/CardContext";
import {
  useAnkiField,
  useBreakpoint,
  useConfig,
} from "#/components/shared/Context";

import type { DaisyUITheme } from "./theme";

export function useSentenceField() {
  const [card] = useCardStore();
  const { ankiFields } = useAnkiField();
  const sentenceField = () => {
    if (card.side === "front") {
      return ankiFields["kanji:Sentence"];
    }
    if (card.nested) return ankiFields.Sentence;
    return ankiFields["furigana:SentenceFurigana"]
      ? ankiFields["furigana:SentenceFurigana"]
      : ankiFields["kanji:Sentence"];
  };

  // onMount(() => {
  //   if (card.sentenceFieldRef) {
  //     const ruby = card.sentenceFieldRef.querySelectorAll("ruby");
  //     ruby.forEach((el) => {
  //       el.classList.add(..."[&_rt]:invisible hover:[&_rt]:visible".split(" "));
  //     });
  //   }
  // });

  return sentenceField;
}

export function useViewTransition() {
  function startViewTransition(
    callback: () => void,
    {
      beforeCallback,
    }: {
      beforeCallback?: () => void;
    } = {},
  ) {
    if (document.startViewTransition) {
      beforeCallback?.();
      return document.startViewTransition(callback);
    } else {
      callback();
    }
  }
  return startViewTransition;
}

export function useNavigationTransition() {
  const [card, setCard] = useCardStore();
  const bp = useBreakpoint();
  const startViewTransition = useViewTransition();

  function navigate(
    destination: "main" | "settings" | "nested" | "kanji" | (() => void),
    direction: "back" | "forward",
  ) {
    const start = () => {
      if (typeof destination === "function") {
        destination();
      } else {
        setCard("page", destination);
      }
    };

    if (!bp.isAtLeast("sm")) {
      startViewTransition(start, {
        beforeCallback() {
          document.documentElement.dataset.transitionDirection = direction;
        },
      })?.finished.then(() => {
        document.documentElement.removeAttribute("data-transition-direction");
      });
    } else {
      start();
    }
  }

  return navigate;
}

export function useThemeTransition() {
  const [config, setConfig] = useConfig();
  const startViewTransition = useViewTransition();

  function changeTheme(theme: DaisyUITheme) {
    startViewTransition(() => setConfig("theme", theme), {
      beforeCallback() {
        document.documentElement.dataset.themeTransition = "true";
      },
    })?.finished.then(() => {
      document.documentElement.removeAttribute("data-theme-transition");
    });
  }
  return changeTheme;
}
