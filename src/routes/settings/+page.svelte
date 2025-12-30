<script lang="ts">
  import { app } from '$lib/app.svelte.js';
  import Toggle from '$lib/Toggle.svelte';
  import { AdMob } from '@capacitor-community/admob';
  import { AdvertisingId } from '@capacitor-community/advertising-id';

  function showPrivacyOptionsForm() {
    AdMob.showPrivacyOptionsForm();
  }

</script>

<section>
  <h1>Settings</h1>
  <div class="setting">
    <div class="input">
      <input type="range"
             bind:value={app.hrMax}
             min="140"
             max="220"
      />
      {app.hrMax}
    </div>
    <p>
      Heart rate maximum. Used for determining low, medium, and high heart rate.
    </p>
  </div>
  <div class="setting">
    <div class="input">
      <Toggle bind:value={app.showAds} />
    </div>
    <p>
      Show me ads to support the development of Open Source software like this.
    </p>
  </div>
  {#if app.showAds}
  <div class="setting centered">
    <button onclick={showPrivacyOptionsForm}>Show AdMob privacy options</button>
  </div>
  <div class="setting centered ad-info">
    {#await AdvertisingId.getAdvertisingId()}
      &nbsp;
    {:then advertisingIdInfo }
      <p>Advertising consent: {advertisingIdInfo.status}</p>
      <span>Your advertising ID:</span>
      <span>{advertisingIdInfo.id}</span>
    {:catch _}
      &nbsp;
    {/await}
  </div>
  {/if}
  <div class="danger">
    <p>If something goes wrong and you want to reset the application state, you can use this.</p>
    <div class="setting centered">
      <button class="reset" onclick={() => app.reset()}>Reset application</button>
    </div>
  </div>
</section>

<style lang="scss">
  @use "variables" as *;

  section {
    display: flex;
    flex-direction: column;
  }

  .setting {
    display: flex;
    flex-direction: row;
    padding: $spacing-2 0;
    align-items: center;
    gap: 1rem;

    .input {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 7rem;
    }

    &.centered {
      justify-content: center;
    }

    &.ad-info {
      flex-direction: column;
      gap: $spacing-1;
    }
  }

  .danger {
    margin: $spacing-4 (-$spacing-2) 0 (-$spacing-2);
    padding: $spacing-1 $spacing-2;

    display: flex;
    flex-direction: column;

    border-top: 1px solid rgba(255, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 0, 0, 0.2);
    background: rgba(255, 0, 0, 0.1);

    p {
      margin: 0 $spacing-3;
    }
  }
</style>
