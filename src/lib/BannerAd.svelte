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
  import { app } from '$lib/app.svelte';
  import { errorToString } from '$lib/utils';

  let interval: NodeJS.Timeout | undefined = undefined
  const AD_INTERVAL = 60_000

  async function banner(): Promise<void> {
    try {
      await app.initAds()

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
        // margin: 8,
        // isTesting: true,
        // npa: true
      };

      await AdMob.showBanner(options);
    } catch(e) {
      console.error("Error showing banner:", errorToString(e as Error))
    }
  }

  onMount(() => {
    banner().then(() => {})
    interval = setInterval(banner, AD_INTERVAL)
  })

  onDestroy(() => {
    if (interval !== undefined) {
      clearInterval(interval)
    }
    AdMob.removeBanner().then(() => {})
  })
</script>
