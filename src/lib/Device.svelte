<script>
  import { app } from "$lib/app.svelte.ts"

  let { item, enabled } = $props()
</script>

<div class="result"
     class:clickable={enabled}
     onclick={() => enabled && app.connect(item)}>
  <div class="result-left">
    <div class="device-name">{item.device.name}</div>
    <div class="device-id">{item.device.deviceId}</div>
  </div>
  {#if enabled}
    <div class="rssi">{item.rssi} dBm</div>
  {/if}
</div>

<style lang="scss">
  @use "variables" as *;

  .result {
    padding: $spacing-2 $spacing-1+$spacing-2;
    background: lighten($blue-deep, 3%);
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin: 0 (-$spacing-2);

    .result-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: $spacing-1;

      .device-id {
        font-size: 0.8rem;
        opacity: 55%;
      }
    }

    .rssi {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &:nth-of-type(odd) {
      background: lighten($blue-deep, 6%);
    }

    &.clickable {
      cursor: pointer;
    }
  }
</style>
