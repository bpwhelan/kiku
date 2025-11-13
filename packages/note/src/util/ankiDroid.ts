import { createEffect, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { useCardStore } from "#/components/shared/Context";

declare global {
  var AnkiDroidJS: {
    ankiDroidInvoke: (direction: "ease1" | "ease3") => void;
  };
}

export function useAnkiDroid(container: HTMLElement) {
  if (isServer) return;
  if (window.innerWidth > 768) return;
  if (typeof AnkiDroidJS === "undefined" && !import.meta.env.DEV) return;

  const [card] = useCardStore();

  const threshold = 80; // how far before triggering swipe
  const deadzone = 20; // ignore small jitters
  const duration = 150; // ms snap duration
  const scrollTolerance = 15; // px vertical diff before assuming scroll

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let isAnimating = false;
  let isScrolling = false;

  function handleTouchStart(e: TouchEvent) {
    if (isAnimating) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    isScrolling = false;
    container.style.transition = "none";
  }

  function handleTouchMove(e: TouchEvent) {
    if (isAnimating || isScrolling) return;

    const t = e.touches[0];
    const diffX = t.clientX - startX;
    const diffY = t.clientY - startY;

    // Detect vertical scroll intent
    if (
      Math.abs(diffY) > scrollTolerance &&
      Math.abs(diffY) > Math.abs(diffX)
    ) {
      isScrolling = true;
      container.style.transform = "";
      return;
    }

    // only start sliding after passing deadzone
    if (Math.abs(diffX) > deadzone) {
      const direction = diffX > 0 ? 1 : -1;

      // 3 stages of slide thresholds
      const stage1 = threshold * 0.3; // small hint slide
      const stage2 = threshold * 0.6; // medium slide
      const stage3 = threshold; // full slide (will trigger)

      let stageValue = 0;

      const abs = Math.abs(diffX);
      if (abs < stage1)
        stageValue = 0; // barely moved
      else if (abs < stage2) stageValue = stage1;
      else if (abs < stage3) stageValue = stage2;
      else stageValue = stage3;

      const target = stageValue * direction;

      // add small smooth transition between steps
      container.style.transition = `transform ${duration}ms ease-out`;
      container.style.transform = `translateX(${target}px)`;

      deltaX = target;
    }
  }

  function handleTouchEnd() {
    if (isAnimating || isScrolling) return;

    if (Math.abs(deltaX) > threshold && typeof AnkiDroidJS !== "undefined") {
      if (deltaX > 0) {
        AnkiDroidJS.ankiDroidInvoke("ease3");
      } else {
        AnkiDroidJS.ankiDroidInvoke("ease1");
      }
    }

    snapBack();
  }

  function snapBack() {
    if (card.backRef === undefined) return;
    isAnimating = true;
    container.style.transition = `transform ${duration}ms ease-out`;
    container.style.transform = "translateX(0)";

    const timer = setTimeout(cleanup, duration + 100);
    const end = () => cleanup();

    function cleanup() {
      if (card.backRef === undefined) return;
      clearTimeout(timer);
      card.backRef.removeEventListener("transitionend", end);
      isAnimating = false;
      container.style.transition = "";
    }

    card.backRef.addEventListener("transitionend", end);
  }

  createEffect(() => {
    if (card.backRef === undefined) return;
    card.backRef.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    card.backRef.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    card.backRef.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });

    onCleanup(() => {
      if (card.backRef === undefined) return;

      card.backRef.removeEventListener("touchstart", handleTouchStart);
      card.backRef.removeEventListener("touchmove", handleTouchMove);
      card.backRef.removeEventListener("touchend", handleTouchEnd);
    });
  });
}
