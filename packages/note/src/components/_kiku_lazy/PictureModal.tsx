import { createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { useViewTransition } from "#/util/hooks";

export default function PictureModal(props: {
  img: string | undefined;
  "on:click"?: () => void;
}) {
  const [img, setImg] = createSignal(props.img);
  const startViewTransition = useViewTransition();

  createEffect(() => {
    props.img;
    startViewTransition(() => {
      setImg(props.img);
    });
  });

  return (
    <Portal mount={KIKU_STATE.root}>
      <div
        part="picture-modal"
        class="absolute z-20 top-0 left-0 w-full h-full p-4 sm:p-8 bg-black/75 flex justify-center items-center [&_*:not(img)]:contents transition-opacity"
        classList={{
          hidden: !img(),
        }}
        on:click={props["on:click"]}
        innerHTML={img() ?? ""}
      ></div>
    </Portal>
  );
}
