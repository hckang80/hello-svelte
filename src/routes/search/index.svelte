<script lang="ts">
  import { fade } from 'svelte/transition'
  import { debounce, getItem, setItem, request } from '$lib/useFunction'

  let keyword = ''

  let searchedList: string[] = []

  let selected = {
    index: -1 as number,
    list: [] as string[]
  }

  const resetSelectedIndex = () => {
    typeof selected.index === 'number' && (selected.index = -1)
  }

  const searchList = debounce && debounce(async () => {
    if (!keyword) return searchedList = []
    const BASE_URI = 'h as numberttps://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'
    const response =
      getItem<string[]>(keyword) ||
      await request<string[]>(`${BASE_URI}/languages?keyword=${keyword}`)
    !getItem(keyword) && setItem(keyword, response)
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

	let key;
	let keyCode;

	function handleKeydown(event) {
    if (!searchedList.length) return
		key = event.key;
		keyCode = event.keyCode;

    console.log({ key, keyCode })
	}
</script>

<div class="Search">
  <div class="selected-list">
    <ul>
      {#each selected.list as item}
        <li>{item}</li>
      {/each}
    </ul>
  </div>

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

  {#if searchedList.length}
  <div transition:fade="{{ duration: 100 }}" class="searched-list">
    <ul class="suggestion">
      {#each searchedList as item, index}
        <li
          class="{selected.index === index && 'suggestion__item--selected'}"
          on:click={() => selectList(index)}>
          {item}
        </li>
      {/each}
    </ul>
  </div>
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
  color: var(--color-dark);
}

.searched-list {
  position: relative;
  font-size: 20px;
  width: 300px;
  top: 100%;
  z-index: 1;
  margin-top: 10px;
  padding: 10px;
  border-radius: 24px;
  border: 1px solid black;
}

.searched-list li {
  padding: 10px;
  cursor: pointer;
  width: 100%;
}

.suggestion li:hover {
  background-color: #90CDF4;
}

.suggestion__item--selected {
  background-color: #BEE3F8;
}

.suggestion__item--matched {
  background-color: #9AE6B4;
}

.selected-list {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 10px;
}

.selected-list li {
  display: inline-block;
  margin: 0 2px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 100px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
