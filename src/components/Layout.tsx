import type { JSX } from "solid-js";

export function Layout(props: { children: JSX.Element }) {
  return (
    <div class="max-w-4xl mx-auto overflow-auto p-2 sm:p-4 gutter-stable h-svh">
      <div class="flex flex-col gap-6 ">{props.children}</div>
    </div>
  );
}
