<script lang="ts">
  import {
    AdMob,
    type AdMobBannerSize,
    type BannerAdOptions,
    BannerAdPluginEvents,
    BannerAdPosition,
    BannerAdSize
  } from '@capacitor-community/admob';
  import { onDestroy, onMount } from 'svelte';

  let interval: NodeJS.Timeout | undefined = undefined
  const AD_INTERVAL = 60_000

  async function banner(): Promise<void> {
    await AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    await AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (_size: AdMobBannerSize) => {
        // Subscribe Change Banner Size
      }
    );

    const options: BannerAdOptions = {
      adId: 'ca-app-pub-5661191480452595/9221966971',
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0
      // isTesting: true
      // npa: true
    };

    await AdMob.showBanner(options);
  }

  onMount(() => {
    banner()
    interval = setInterval(banner, AD_INTERVAL)
  })

  onDestroy(() => {
    if (interval !== undefined) {
      clearInterval(interval)
    }
  })
</script>
