<script lang="ts">
  import { app, HISTORY_MAX_LENGTH } from '$lib/app.svelte.js';
  import { Axis, Layer, LineChart, Spline } from 'layerchart';

  const HR_MIN = 50;
  const HR_MAX = 200;

  const values = $derived(app.heartRateHistory.map((item) => item.value).filter((item) => item !== null));
  const hasData = $derived(app.heartRateHistory.some((item) => item.value !== null));
  const min = $derived(hasData ? Math.min(...values) : undefined);
  const max = $derived(hasData ? Math.max(...values) : undefined);
</script>

<section>
  <h1>Heart rate over time</h1>
  <div class="chart">
    {#if !hasData}
      <div class="waiting">
        Waiting for data...
      </div>
    {:else}
      <LineChart
        data={app.heartRateHistory}
        x="date"
        y="value"
        yDomain={[HR_MIN, HR_MAX]}
        padding={{top: 32, right: 16, bottom: 16, left: 48}}
        brush
      >
        <Layer type="svg">
          <Axis placement="left" grid rule />
          <Axis placement="bottom" ticks={HISTORY_MAX_LENGTH / 60} rule />
          <Spline class="line" />
        </Layer>
      </LineChart>
    {/if}
  </div>
  <div class="summary">
    {#if hasData}
      <span class="hr">{min}</span> - <span class="hr">{max}</span> bpm
    {:else }
      &nbsp;
    {/if}
  </div>
</section>

<style lang="scss">
  @use "variables" as *;

  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    justify-items: center;

    .chart {
      max-width: 100vw;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .waiting {
        text-align: center;
      }
    }

    .summary {
      color: $accent;
      font-size: 16px;
      text-align: center;
      padding: $spacing-4 0 $spacing-1 0;

      .hr {
        color: $accent;
        font-size: 20px;
      }
    }
  }

  :global(section .chart svg text.lc-axis-tick-label) {
    font-family: 'Monaspace Neon', monospace;
    font-size: 15px;
    font-weight: 200;
    stroke-width: 1px;
  }


  :global(section .chart svg .line) {
    stroke: $accent-high;
    stroke-width: 4px;
  }

</style>
