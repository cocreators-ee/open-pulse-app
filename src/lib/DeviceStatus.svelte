<script lang="ts">
  import { app } from '$lib/app.svelte.js';

  import BatteryFull from '$lib/assets/lucide/battery-full.svg?component';
  import BatteryMedium from '$lib/assets/lucide/battery-medium.svg?component';
  import BatteryLow from '$lib/assets/lucide/battery-low.svg?component';
</script>

<div class="status-bar">
  <div class="status-item">
    {#if !app.connected || app.currentBatteryLevel! <= 33}
      <BatteryLow />
    {:else if app.currentBatteryLevel! <= 66}
      <BatteryMedium />
    {:else}
      <BatteryFull />
    {/if}
    {#if app.connected}
      <span class="battery-level">
        {app.currentBatteryLevel}%
      </span>
    {:else}
      - %
    {/if}
  </div>
</div>

<style lang="scss">
  @use "variables" as *;

  .status-bar {
    display: flex;
    flex-direction: row;
    height: 48px;
    margin: $spacing-2 0 $spacing-3 0;
    align-items: center;
    justify-content: center;

    .status-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: $spacing-2;

      .battery-level {
        width: 2.5rem;
        text-align: right;
      }
    }
  }

  :global(.status-bar svg) {
    stroke: $accent;
  }
</style>
