import { createEffect, createSignal } from "solid-js";

export default function ImageModal(props: {
  img: string | undefined;
  "on:click"?: () => void;
}) {
  const [showModal, setShowModal] = createSignal(false);
  const [transparent, setTransparent] = createSignal(true);

  let id: number;
  createEffect(() => {
    if (id) clearTimeout(id);
    if (props.img) {
      setShowModal(true);
      setTimeout(() => {
        setTransparent(false);
      }, 0);
    } else {
      setTransparent(true);
      id = setTimeout(() => {
        setShowModal(!!props.img);
      }, 200);
    }
  });

  return (
    <div
      class="picture-modal"
      data-modal-hidden={showModal() ? "false" : "true"}
      data-modal-transparent={transparent() ? "true" : "false"}
      on:click={props["on:click"]}
      innerHTML={props.img}
    ></div>
  );
}
