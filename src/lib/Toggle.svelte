<script lang="ts">
  let {value = $bindable()} = $props()
</script>

<div
  onclick={() => value = !value}
  onkeydown={() => value = !value}
  class="interact"
  tabindex="0"
  role="button">
  <div class="slider">
    <div class="pin"
        class:enabled={value}></div>
  </div>
</div>

<style lang="scss">
  @use "variables" as *;

  .slider {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 4rem;
    height: 1.5rem;

    border-radius: 0.75rem;
    background: $blue-dark;
    border: 1px solid $border-color;

    position: relative;

    .pin {
      position: absolute;
      display: flex;
      flex-direction: column;
      left: 0;

      border-radius: 50%;
      border: 2px solid $border-color;
      background-color: $accent;

      width: 24px;
      height: 24px;

      transition: left 0.2s ease-in-out;

      &.enabled {
        left: 38px;
      }
    }
  }
</style>
