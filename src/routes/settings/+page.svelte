<script lang="ts">
  import { app } from '$lib/app.svelte.js';
  import Toggle from '$lib/Toggle.svelte';
</script>

<section>
  <h1>Settings</h1>
  <div class="setting">
    <div class="input">
      <input type="number"
             bind:value={app.hrMax}
             min="140"
             max="220"
      />
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
  <div class="danger">
    <p>If something goes wrong and you want to reset the application state, you can use this.</p>
    <div class="setting">
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
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 7rem;
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

    .setting {
      justify-content: center;
    }
  }
</style>
