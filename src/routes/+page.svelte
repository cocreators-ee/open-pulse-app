<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(async () => {
    await app.waitUntilLoaded();
    console.log('PAGE LOAD', app.selectedDevice);
    if (app.selectedDevice !== undefined) {
      goto('/monitor/');
    } else {
      goto('/connection/');
    }
  });
</script>

<!-- Loading the application -->
