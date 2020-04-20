import Solitaire from './Solitaire.svelte';

const app = new Solitaire({
	target: document.body
});

window.app = app;

export default app;