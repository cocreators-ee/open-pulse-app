<script lang="ts">
  import { buyMeACoffee, openLink } from '$lib/utils.ts';
  import { app } from '$lib/app.svelte';

  async function openPrivacy(evt) {
    evt.preventDefault();
    app.showPrivacy = true;
  }
</script>

<section>
  <h1>About this app</h1>

  <p>You can connect to heart rate monitors that support Bluetooth LE, such as the widely available chest
    straps and arm bands.</p>

  <p>This app is open source, and has been built by Cocreators OÜ.</p>

  <p>We use <a href="https://lucide.dev/icons/" onclick={openLink}>Lucide Icons</a> released under
    the ISC License.</p>

  <p>We use the Merriweather Sans font under the OFL-1.1 License. Copyright 2019 The <a
    href="https://github.com/SorkinType/Merriweather-Sans" onclick={openLink}>Merriweather
    Project</a> Authors.</p>
  <p>You can support our development of open source applications by enabling ads, or by sending us a tip,
    every little bit helps.</p>

  <button onclick={() => buyMeACoffee()}>Tip the developer</button>

  <div>
    <a href="https://github.com/cocreators-ee/heart-rate-app" onclick={openLink}>Check out the source code on GitHub</a>
  </div>

  <div>
    <a href="#" onclick={openPrivacy}>View the privacy policy</a>
  </div>
</section>

<style lang="scss">
  @use "variables" as *;

  section {
    display: flex;
    flex-direction: column;
  }

  button {
    align-self: center;
    margin: $spacing-4 0;
  }

  div {
    margin: $spacing-2 0;
    text-align: center;
  }
</style>
