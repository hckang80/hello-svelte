<script lang="ts">
  import { debounce, getItem, setItem, request } from '$lib/useFunction'

  import SelectedList from './SelectedList.svelte'
  import SearchedList from './SearchedList.svelte'

  const DEFAULT_SELETED_INDEX = -1
  const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'

  let keyword = ''

  let searchedList: string[] = []

  let selected = {
    index: DEFAULT_SELETED_INDEX as number,
    list: [] as string[]
  }

  $: hasSelectedItem = selected.index >= 0
  $: cashedList = getItem?.(keyword) as string[]

  const resetSelectedIndex = () => {
    hasSelectedItem && (selected.index = DEFAULT_SELETED_INDEX)
  }

  const searchList = debounce?.(async () => {
    if (!keyword) return searchedList = []
    const response =
      cashedList ||
      await request<string[]>(`${BASE_URI}/languages?keyword=${keyword}`)
    !cashedList && setItem(keyword, response)
    resetSelectedIndex()
    searchedList = response
  }, 500)

  const deleteItem = (item) => {
    selected.list.splice(selected.list.indexOf(item), 1)
  }

  const toValidSelectList = (index: number): string[] => {
    const hasItem = selected.list.includes(searchedList[index])
    const LIMIT = 5
    hasItem && deleteItem(searchedList[index])
    const list = [...selected.list, searchedList[index]].slice(-1 * LIMIT)
    return list
  }

  const selectList = (index: number) => {
    selected = {
      index,
      list: toValidSelectList(index)
    }
  }

	function handleKeydown(event) {
    if (!searchedList.length) return

    const events = {
      ArrowUp: () => {
        selected.index <= 0 &&
          (selected.index = searchedList.length)
        selected.index -= 1
      },
      ArrowDown: () => {
        selected.index === searchedList.length - 1 &&
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
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<div class="Search">
  <SelectedList list={selected.list} />

  <form
    on:submit|preventDefault={() => {}}
    class="search-form">
    <input
      type="text"
      placeholder="프로그래밍 언어를 입력하세요."
      class="search-form__input"
      bind:value={keyword}
      on:input={searchList}
    />
  </form>

  {#if searchedList.length}
  <SearchedList
    {searchedList}
    selectedIndex={selected.index}
    {selectList}
  />
  {/if}
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
