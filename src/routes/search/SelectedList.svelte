<script type="ts">
import { flip } from 'svelte/animate'

export let list
export let send
export let receive
</script>

<div class="selected-list">
  <ul>
    {#each list as item (item)}
      <li
        in:receive="{{key: item}}"
        out:send="{{key: item}}"
        animate:flip={{ duration: 200 }}
      >
        {item}
      </li>
    {/each}
  </ul>
</div>

<style>
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