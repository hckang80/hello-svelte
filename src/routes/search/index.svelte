<script lang="ts">
  import { debounce, getItem, setItem, request } from '$lib/useFunction'

  let keyword = ''

  let searchedList = []

  let selected = {
    index: null
  }

  const searchList = debounce && debounce(async () => {
    if (!keyword) return searchedList = []
    const BASE_URI = 'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev'
    const response =
      getItem<string[]>(keyword) ||
      await request<string[]>(`${BASE_URI}/languages?keyword=${keyword}`)
    !getItem(keyword) && setItem(keyword, response)
    searchedList = response
  }, 500)

  const selectList = (index) => {
    selected.index = index
  }
</script>

<main class="Search">
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
  <div class="searched-list">
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
</main>

<style>
.Search {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  justify-content: center;
  align-items: center;
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
  position: absolute;
  font-size: 20px;
  width: 300px;
  top: 50%;
  z-index: 1;
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
  flex-wrap: nowrap;
  height: 37.5px;
  margin-top: -100px;
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
