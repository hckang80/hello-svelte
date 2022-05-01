import { writable } from 'svelte/store'

export const searchedList = writable<string[]>([])
