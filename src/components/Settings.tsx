import { BoltIcon } from "lucide-solid";
import { For } from "solid-js";
import {
  type DaisyUITheme,
  daisyUIThemes,
  getTheme,
  nextTheme,
  setTheme,
} from "../util/theme";

export function Settings(props: { onHomeClick: () => void }) {
  let formEl: HTMLFormElement | undefined;
  return (
    <>
      <div class="flex flex-row justify-start">
        <div class="h-5">
          <BoltIcon
            class="h-full w-full cursor-pointer text-base-content/50"
            on:click={props.onHomeClick}
          ></BoltIcon>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="text-2xl font-bold">Theme</div>
        <form
          ref={formEl}
          class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2"
          on:change={() => {
            const input = formEl?.querySelector(
              "input[name=theme-buttons]:checked",
            ) as HTMLInputElement;
            const value = input?.value;
            if (value) setTheme(value as DaisyUITheme);
          }}
        >
          <For each={daisyUIThemes}>
            {(theme) => {
              return (
                <input
                  type="radio"
                  name="theme-buttons"
                  class="btn theme-controller join-item"
                  aria-label={theme}
                  value={theme}
                />
              );
            }}
          </For>
        </form>
      </div>
    </>
  );
}
