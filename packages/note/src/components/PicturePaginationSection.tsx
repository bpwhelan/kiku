import { lazy } from "solid-js";
import { useFieldGroupContext } from "./shared/FieldGroupContext";

// biome-ignore format: this looks nicer
const Lazy = {
  PicturePagination: lazy(async () => ({ default: (await import("./_kiku_lazy")).PicturePagination, })),
};

export function PicturePaginationSection() {
  const { $group } = useFieldGroupContext();

  return (
    <div
      class="flex justify-between text-base-content-soft items-center gap-2 animate-fade-in h-5 sm:h-8"
      classList={{
        hidden: $group.ids.length <= 1,
      }}
    >
      <Lazy.PicturePagination />
    </div>
  );
}
