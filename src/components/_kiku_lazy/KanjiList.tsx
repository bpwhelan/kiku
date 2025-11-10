import { ArrowLeftIcon } from "./Icons";

export default function KanjiList(props: { onBackClick?: () => void }) {
  return (
    <>
      <div class="flex flex-row justify-between items-center animate-fade-in">
        <div class="h-5">
          <ArrowLeftIcon
            class="h-full w-full cursor-pointer text-base-content-soft"
            on:click={props.onBackClick}
          ></ArrowLeftIcon>
        </div>
        <div class="flex flex-row gap-2 items-center"></div>
      </div>
      <div>body</div>
    </>
  );
}
