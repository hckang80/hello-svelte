<script>
import { fade } from 'svelte/transition'

export let searchedList
export let selectedIndex
export let selectList
</script>


<div transition:fade="{{ duration: 100 }}" class="searched-list">
  <ul class="suggestion">
    {#each searchedList as item, index}
      <li
        class="{selectedIndex === index && 'suggestion__item--selected'}"
        on:click={() => selectList(index)}>
        {item}
      </li>
    {/each}
  </ul>
</div>

<style>
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
</style>
