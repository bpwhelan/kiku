import type { JSX } from "solid-js";
import { useBreakpoint } from "./shared/Context";

export function Layout(props: { children: JSX.Element }) {
  const bp = useBreakpoint();
  return (
    <div class="max-w-4xl mx-auto overflow-auto px-2 sm:px-4 gutter-stable">
      <div
        class="flex flex-col gap-6"
        style={{
          height: `calc(100vh - ${bp.isAtLeast("sm") ? "4em" : "2em"})`,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
