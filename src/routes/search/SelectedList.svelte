<script type="ts">
export let list
</script>

<div class="selected-list">
  <ul>
    {#each list as item}
      <li>{item}</li>
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