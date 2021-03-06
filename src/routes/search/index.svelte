<script lang="ts">
  import { clickOutside, debounce, getItem, setItem, request } from '$lib/useFunction'
	import { quintOut } from 'svelte/easing'
	import { crossfade } from 'svelte/transition'
  import { searchedList } from '$stores'

  import SelectedList from './SelectedList.svelte'
  import SearchedList from './SearchedList.svelte'

  const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node) {
			const style = getComputedStyle(node)
			const transform = style.transform === 'none' ? '' : style.transform

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t};
				`
			}
		}
	})

  const DEFAULT_SELETED_INDEX = -1
  const LIMIT = 5
  const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'

  let keyword = ''

  let selected = {
    index: DEFAULT_SELETED_INDEX,
    list: new Set<string>()
  }

  $: list = [...selected.list]
    .filter(Boolean)
    .slice(-1 * LIMIT)
  $: hasSelectedItem = selected.index >= 0
  $: cashedList = getItem<string[]>(keyword)

  const resetSelectedIndex = () => {
    hasSelectedItem && (selected.index = DEFAULT_SELETED_INDEX)
  }

  const searchList = debounce(async () => {
    if (!keyword) return searchedList.set([])
    const response =
      cashedList ||
      await request<string[]>(`${BASE_URI}/languages?keyword=${keyword}`)
    !cashedList && setItem(keyword, response)
    resetSelectedIndex()
    searchedList.set(response)
  }, 500)

  const uniqueSelectedList = (index: number): Set<string> => {
    const selectedItem = $searchedList[index]
    const hasItem = selected.list.has(selectedItem)
    hasItem && selected.list.delete(selectedItem)
    selected.list.add(selectedItem)
    return selected.list
  }

  const selectList = (index: number) => {
    selected = {
      index,
      list: uniqueSelectedList(index)
    }
  }

	const handleKeydown = (event) => {
    if (!$searchedList.length) return

    const events = {
      ArrowUp: () => {
        selected.index <= 0 &&
          (selected.index = $searchedList.length)
        selected.index -= 1
      },
      ArrowDown: () => {
        selected.index === $searchedList.length - 1 &&
          (selected.index = DEFAULT_SELETED_INDEX)
        selected.index += 1
      },
      Enter: () => {
        event.preventDefault()
        hasSelectedItem && selectList(selected.index)
      }
    }
    events[event.key]?.()
	}

  const handleClickOutside = (event: CustomEvent<HTMLDivElement>) => {
    $searchedList.length && searchedList.set([])
  }
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<div class="Search">
  <SelectedList
    {send}
    {receive}
    {list}
  />

  <div
    use:clickOutside
    on:click_outside={handleClickOutside}
    class="searched-form">
    <form
      class="search-form">
      <input
        type="text"
        placeholder="프로그래밍 언어를 입력하세요."
        class="search-form__input"
        bind:value={keyword}
        on:input={searchList}
      />
    </form>

    {#if $searchedList.length}
    <SearchedList
      selectedIndex={selected.index}
      {selectList}
    />
    {/if}
  </div>
</div>

<svelte:window on:keydown={handleKeydown}/>

<style>
.Search {
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
}

.search-form {
  width: 300px;
}

.search-form__input {
  width: 100%;
  border: 1px solid black;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 20px;
}
</style>
