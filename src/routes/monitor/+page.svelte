<script lang="ts">
  import { app } from '$lib/app.svelte.js';
  import DeviceStatus from '$lib/DeviceStatus.svelte';
  import { onDestroy, onMount } from 'svelte';

  let circle: HTMLDivElement;
  let animationFrameHandle: number | undefined = undefined;
  let nextPulse = 0;
  let lastPulse = 0;
  const HR_MIN = 80;

  function pulseSize(pulse: number) {
    let minPx = 160;
    let maxPx = 224;
    let hrMin = HR_MIN;
    let hrMax = app.hrMax;

    let size = minPx + (maxPx - minPx) * (pulse - hrMin) / (hrMax - hrMin);
    size = Math.max(minPx, Math.min(maxPx, size));
    return size;
  }

  function pulseDelay(pulse: number) {
    return 60_000 / pulse;
  }

  // TODO: Border color based on pulse

  function onAnimationFrame() {
    let now = Date.now();
    let currentPulse = (app.currentHeartRate ?? HR_MIN) * 2;

    let size = pulseSize(currentPulse);
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;

    let sinceLast = now - lastPulse

    if (now > nextPulse && (app.currentHeartRate ?? 0) > 0 && sinceLast > 25) {
      if (!circle.classList.contains('pulse')) {
        circle.classList.add('pulse');

        // Schedule next pulse
        let delay = pulseDelay(currentPulse);
        nextPulse = now + delay;
      }
    }

    animationFrameHandle = window.requestAnimationFrame(onAnimationFrame);
  }

  function onAnimationEnd() {
    lastPulse = Date.now()
    circle.classList.remove('pulse');
  }

  onMount(() => {
    circle.addEventListener('animationend', () => onAnimationEnd());
    animationFrameHandle = window.requestAnimationFrame(onAnimationFrame);
  });

  onDestroy(() => {
    if (animationFrameHandle !== undefined) {
      window.cancelAnimationFrame(animationFrameHandle);
    }
  });
</script>

<section>
  <h1>Monitor heart rate</h1>

  <div class="heart-rate">
    <div class="hr-number">
      {#if app.connected && (app.currentHeartRate ?? 0) > 0}
        {app.currentHeartRate}
      {:else}
        -
      {/if}
    </div>
    <div class="hr-unit">bpm</div>

    <div class="circle" bind:this={circle}></div>
    <p class:hidden={(app.currentHeartRate ?? 0) > 0}>
      Sometimes it takes a few seconds for the heart rate to start reporting after wearing or connecting to a device.
      <br />
      <br />
      Check your connection if this is taking longer than expected.
    </p>
  </div>

  <DeviceStatus />
</section>

<style lang="scss">
  @use "variables" as *;

  section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .heart-rate {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    scale: min(calc((100vh - 0px) / 720px), 1);

    .hr-number {
      font-size: 2.25rem;
      font-weight: bold;
    }

    .hr-unit {
      font-size: 1.5rem;
    }

    .circle {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      border-radius: 50%;
      border: 16px solid $accent-low;
      box-shadow: 0px 0px 4px 4px rgba(106, 239, 138, 0.2);

      width: 160px;
      height: 160px;
    }

    p {
      position: absolute;
      bottom: 0;

      opacity: 1;
      transition: opacity 0.5s ease-in-out;

      &.hidden {
        opacity: 0;
      }
    }
  }

  :global(.circle.pulse) {
    animation-duration: 150ms;
    animation-iteration-count: 1;
    animation-name: pulse;
    animation-timing-function: ease-in-out;
  }
</style>
