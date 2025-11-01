import type { AnkiFields } from "./types";

function App(props: { ankiFields: AnkiFields }) {
	return (
		<div class="max-w-4xl mx-auto">
			<div class="flex rounded-lg gap-4 h-56">
				<div class="flex-1 bg-base-200 rounded-lg flex flex-col items-center justify-center">
					<div class="text-6xl" innerHTML={props.ankiFields.Expression}></div>
				</div>
				<div
					class="[&_>_img]:h-full [&_>_img]:rounded-lg"
					innerHTML={props.ankiFields.Picture}
				></div>
			</div>
		</div>
	);
}

export default App;
