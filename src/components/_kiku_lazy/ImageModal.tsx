export default function ImageModal(props: {
  img: string | undefined;
  "on:click"?: () => void;
}) {
  return (
    <div
      class="picture-modal"
      data-modal-hidden={props.img ? "false" : "true"}
      on:click={props["on:click"]}
      innerHTML={props.img}
    ></div>
  );
}
