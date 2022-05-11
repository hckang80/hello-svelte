/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	// interface Platform {}

	// interface Session {}

	// interface Stuff {}
}

declare namespace svelte.JSX {
  interface HTMLProps<T> {
    onclick_outside?: (event: CustomEvent<T>) => void
  }
}

