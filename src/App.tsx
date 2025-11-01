import type { AnkiFields } from "./types";

function App(props: { ankiFields: AnkiFields }) {
	return (
		<div class="bg-base-200" data-theme="coffee">
			<button class="btn">test</button>
			<div class="flex">
				<div class="flex-1 flex flex-col items-center justify-center">
					<div class="text-6xl" innerHTML={props.ankiFields.Expression}></div>
				</div>
				<div class="[&_>_img]:h-64" innerHTML={props.ankiFields.Picture}></div>
			</div>
		</div>
	);
}

export default App;
