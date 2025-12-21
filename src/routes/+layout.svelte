<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { app } from '$lib/app.svelte';
  import { buyMeACoffee, openLink } from '$lib/utils.ts';

  import '@fontsource-variable/merriweather-sans';
  import '$style/setup.scss';

  import Bluetooth from '$lib/assets/lucide/bluetooth.svg?component';
  import BluetoothConnected from '$lib/assets/lucide/bluetooth-connected.svg?component';
  import HeartPulse from '$lib/assets/lucide/heart-pulse.svg?component';
  import Info from '$lib/assets/lucide/info.svg?component';
  import Settings from '$lib/assets/lucide/settings.svg?component';
  import Cross from '$lib/assets/lucide/x.svg?component';
  import Check from '$lib/assets/lucide/check.svg?component';
  import BannerAd from '$lib/BannerAd.svelte';

  let { children } = $props();
  let currentPath = $derived(page.url.pathname);

  async function allowAds() {
    app.showAdConsent = false;

    await app.enableAds()
  }

  async function disallowAds() {
    app.showAdConsent = false;

    await app.disableAds()
  }

  async function doBuyMeACoffee() {
    app.showAds = false;
    app.showAdConsent = false;

    await app.save()
    await buyMeACoffee();
  }

  function showPrivacy(evt) {
    evt.preventDefault();
    app.showPrivacy = true;
  }

  function hidePrivacy() {
    app.showPrivacy = false;
  }
</script>

<nav>
  <div class="nav-button"
       class:selected={currentPath === "/connection/"}
       onclick={() => goto("/connection/")}
       onkeydown={() => goto("/connection/")}
       role="button"
       tabindex="0">
    <div class="icon"
         class:hidden={!app.connected}
         class:blink={app.connecting}>
      <BluetoothConnected />
    </div>
    <div class="icon">
      <Bluetooth />
    </div>
  </div>
  <div class="nav-button"
       class:selected={currentPath === "/monitor/"}
       class:disabled={app.selectedDevice === undefined}
       onclick={() => app.selectedDevice !== undefined && goto("/monitor/")}
       onkeydown={() => app.selectedDevice !== undefined && goto("/monitor/")}
       role="button"
       tabindex="0">
    <HeartPulse />
  </div>
  <!--
  <div class="nav-button"
       class:selected={currentPath === "/history/"}
       class:disabled={app.selectedDevice === undefined}
       onclick={() => app.selectedDevice !== undefined && goto("/history/")}
       onkeydown={() => app.selectedDevice !== undefined && goto("/history/")}
       role="button"
       tabindex="0">
    <BookHeart />
  </div>
  -->
  <div class="nav-button"
       class:selected={currentPath === "/about/"}
       onclick={() => goto("/about/")}
       onkeydown={() => goto("/about/")}
       role="button"
       tabindex="0">
    <Info />
  </div>
  <div class="nav-button"
       class:selected={currentPath === "/settings/"}
       onclick={() => goto("/settings/")}
       onkeydown={() => goto("/settings/")}
       role="button"
       tabindex="0">
    <Settings />
  </div>
</nav>

<main>
  {@render children()}
</main>

{#if app.showPrivacy}
  <div class="dialog-background">
    <div class="dialog privacy">
      <h2>Privacy policy</h2>

      <h3>About the software</h3>
      <p>Cocreators OÜ, it's parents, subsidiaries, affiliates, agents, representatives, consultants,
        employees, officers and directors - collectively "Cocreators", "we", or "us" is the provider of this
        application.</p>
      <p>Cocreators OÜ is an Estonian company with the business ID 14170013. Our official address is Pille tn
        9/3-53, 10138 Tallinn, Estonia. In case of any questions you can contact us via
        support@cocreators.ee</p>
      <p>Throughout this document we will be referring to "the Software", "the app" or "the application". This
        always refers to this application, its website, as well as your use of our support services.</p>

      <h3>Updates to this document</h3>
      <p>This policy may be updated periodically, please check back regularly for any changes. We don't have
        any means to contact you with so we can't notify you of changes. We might try in-app notifications if
        there are major enough changes.</p>
      <h3>About the Privacy Policy</h3>
      <p>The Privacy Policy describes what data is collected of you, how that data is used by Cocreators, and
        our legal basis for doing so. When any information is shared with 3rd parties, and when you have
        choices in the information you share, the information is also listed here.</p>
      <p>"Personal Data" referred to in this document means any data related to an identified or identifiable
        individual.</p>
      <p>By using the application, you're agreeing to the use of your Personal Data according to the practices
        and policies here, and acknowledge that you have read and understood this Privacy Policy.</p>

      <h3>How does the application use cookies</h3>
      <p>We store your preferences on your device, which is things like which heart rate monitor you're
        connecting to, your heart rate maximum, and if you want ads or not.</p>
      <p>If you chose to show ads, the ad service may use cookies according to their policies. Those third
        parties may be placing and reading cookies on your browsers, or using web beacons or IP addresses to
        collect information as a result of ad serving on this application.</p>
      <p>We specifically use Google Mobile Ads SDK (AdMob) for the optional ads, if you use them you can read
        more: <a href="https://www.google.com/policies/privacy/partners/" onclick={openLink}>How
          Google uses data when you use our partners’ sites or apps</a>. If you do not like this, turn off the
        ads.</p>
      <p>You can customize some of the ad personalization settings for Google at <a href="https://adssettings.google.com/u/0/authenticated" onclick={openLink}>adssettings.google.com/u/0/authenticated</a></p>
      <p>Read more about how Google collects data about you at <a href="https://policies.google.com/privacy" onclick={openLink}>policies.google.com/privacy</a> and <a href="https://policies.google.com/technologies/partner-sites" onclick={openLink}>policies.google.com/technologies/partner-sites</a></p>
      <p>Cocreators does not get any of the data AdMob Google Inc. collects about you.</p>
      <p>If you send us a tip via Buy Me A Coffee, they may also collect information about you according to <a
        href="https://buymeacoffee.com/privacy-policy" onclick={openLink}>their privacy policy</a>.</p>

      <h3>What Personal Data does Cocreators collect otherwise?</h3>
      <p>When you contact us via social media, email, our support system, or other means we will have your
        contact information. We only use this to communicate back to you.</p>

      <h3>What purposes is Personal Data used for?</h3>
      <p>The application uses Personal Data for the following reasons:</p>
      <ul>
        <li>To make it possible for you to use the Software.</li>
        <li>To allow you to view ads to support the development of this application.</li>
        <li>To provide support to you when you contact us with questions or reports of problems.</li>
      </ul>
      <p>Our "lawful basis" required by EU data protection law includes:</p>
      <ul>
        <li>Performing the actions laid out in our contract we have with you when you use the Software. In
          certain circumstances, we need your personal data to comply with our obligation to deliver the
          Software.
        </li>
        <li>To comply with legal and accounting requirements: Sometimes the law or our accountants require us
          to collect and use your data for example to follow the tax regulation.
        </li>
        <li>Our legitimate interests - which is an annoyingly vague term, used to signify good and fair
          reasons to use your data in ways that do not hurt you, your rights, or your interests. This includes
          things like our legitimate interest to guarantee and continuously improve on the safety, security,
          and performance of the Software.
        </li>
      </ul>

      <h3>How does Cocreators share your Personal Data?</h3>
      <p>Since social functions are not at the core of the Software, neither is Personal Data at the core of
        our business. Cocreators does not rent, sell, your Personal Data, or otherwise give access to your
        Personal Data to anyone unless to explicitly perform the actions and functions mentioned in this
        document. Really the only way your personal data might get used is if you choose to view ads. If you
        don't like that, consider tipping instead.</p>
      <p>We share your Personal Data in the following ways:</p>
      <ul>
        <li><b>Cocreators staff:</b> We may share your Personal Data with anyone directly involved with the
          operation of the Software, including our affiliates, employees, subsidiaries, and parents, when it
          is reasonably necessary or desirable for us to disclose your data in order to carry out the data
          processing purposes required from us.
        </li>
        <li><b>Agents:</b> We may employ other companies and people to perform tasks in our behalf in certain
          circumstances, and need to share your information with them to provide products or services to you.
          This may include things like delivery of mail or email, data analysis, marketing, processing
          payments, and customer service. Unless explicitly mentioned otherwise, the agents DO NOT have any
          right to use your Personal Data that we share with them beyond what is necessary for them to perform
          their required functions.
        </li>
        <li><b>Statistical and aggregate data:</b> We may provide collected statistical analysis and
          aggregated information about how our users, collectively, use our application. This data is
          typically used to better understand our users and provide you with the optimal experience, or
          improve our marketing. This data does not contain personally identifying information.
        </li>
        <li><b>Communications:</b> When communicating with Cocreators e.g. via our support, we may send you
          email or other communication that may contain Personal Data in it.
        </li>
        <li><b>Business Transfers:</b> In case Cocreators or a substantial amount of its assets were acquired,
          or Cocreators to go out of business or declare bankruptcy, customer information is one of the assets
          that is transferred or acquired by a third party. By using the Software you acknowledge that such
          transfers may occur, and that your Personal Data may be continued to be used by any acquirer of
          Cocreators.
        </li>
        <li><b>Protection of Cocreators, the Software, and complying with the law:</b> We may be required to
          disclose Personal Data to comply with the law or law enforcement, to prevent abuse and fraud on
          Beaver Dam, protect our legal rights, property, or the safety of Cocreators, its staff, users, and
          others. We reserve the right to disclose information when we believe doing so is reasonably
          necessary in these kinds of scenarios.
        </li>
        <li><b>Your explicit consent:</b> When your Personal Data may be shared with 3rd parties for other
          purposes, you will be notified of it, and you will be able to choose whether or not you want to
          share your information.
        </li>
      </ul>

      <h3>What rights do you have?</h3>
      <p>Users of the Software in certain countries and the EU are given certain rights about their personal
        information by law. We at Cocreators believe that these rights belong to everyone.</p>
      <p>As a user of the Software you have the right to access, correct, and request deletion of your
        personal information. You can request a copy of your Personal Data via our support - but there is none
        we can give to you. To delete your Personal Data, you can go reset the application from the settings
        or uninstall it. We may still retain information where required by law or necessary for our legitimate
        business purposes (such as keeping our accountants happy, and our statistics accurate).</p>
      <p>You also have the right to lodge a complaint with a supervisory authority: <a
        href="https://edpb.europa.eu/about-edpb/board/members_en" onclick={openLink}>edpb.europa.eu/about-edpb/board/members_en</a>
      </p>

      <h3>How does Cocreators secure your Personal Data?</h3>
      <p>We at Cocreators are pretty passionate about security. We follow the best practices for protecting
        the data we collect and maintain, including e.g. encryption of traffic over the internet, but where
        possible we go the extra step and ensure that we do not store unnecessary and potentially damaging
        information about our users, and that additional technical means are in place to ensure safety of your
        data.</p>
      <p>We store our data and host our services using European infrastructure whenever possible, in secure
        data centers with strong physical and electronic security measures in place. We limit unnecessary
        access to your data, and do not store it for longer than necessary. Since we use common cloud hosting
        services for cost-efficiency, their ultimate owners are U.S. based entities which means there is some
        risk that U.S. based entities and agencies may gain access to some or all of your data on Beaver Dam.
        We are continuously evaluating alternatives for services that allow us to reduce dependency on U.S.
        based entities that are not fully trustworthy.</p>
      <p>Ultimately no level of security is perfect, and any security system is as weak as its weakest link.
        In the case of Personal Data it is often your personal account credentials, and it is up to you to
        ensure that you use unique and strong passwords on e.g. your email service, as well as two-factor
        authentication where possible to prevent unauthorized access to your account.</p>
      <p>There may also be other failures in the security ranging from bugs, hardware failure, unauthorized
        entry, and other things. In such events we strive to ensure any failures in our security are promptly
        fixed, and reasonable notifications are sent out as soon as possible.</p>

      <h3>How does Cocreators store Personal Data?</h3>
      <p>Cocreators stores Personal Data only as long as it is necessary for the fulfillment of the purposes
        for which it was collected, unless otherwise required or authorized by applicable law. You can choose
        to delete your Personal Data on Beaver Dam by deleting your account, this however does not include
        deletion of data we are required to keep to fulfill our requirements by law, or any anonymized or
        aggregated data we collect for e.g. statistics.</p>
      <p>We have processes in place to ensure Personal Data will be permanently de-identified or deleted if
        required by law, or if no longer required for the purposes for which we collected it.</p>

      <h3>Is Cocreators collecting Personal Data about children?</h3>
      <p>Cocreators does not knowingly collect, maintain, or use Personal Data about children under the age of 13. The service is not targeted towards children, and children under 13 are not permitted to enable ads which enables tracking.</p>

      <h3>Is my data transferred abroad?</h3>
      <p>Cocreators is an Estonian company, and Estonia is a member of the European Union. Cocreators strives to store all its data within the EU, and avoids storing data outside of the EU where possible, however in certain scenarios some Personal Data may be in other countries, such as the United States. When your Personal Data is transferred to those countries, it is protected as described in this Privacy Policy. An example of such transfer would be in case of AdMob - our ad provider.</p>
      <p>If you feel we're needlessly transferring your data abroad and have better solutions to recommend to us, please let us know, we're always looking to improve.</p>

      <p class="thanks">Thanks for reading all the way through this, you're a champ 👍</p>

      <button onclick={() => hidePrivacy()}>Close</button>
    </div>
  </div>
{:else if app.showAdConsent }
  <div class="dialog-background">
    <div class="dialog">
      <h2>Support development</h2>
      <p>Would you like to support the development of this software and other open source applications by
        allowing unintrusive ads to be shown? You should be 13 or older.</p>
      <p>You can also send us a tip instead.</p>
      <p>This dialog is only shown once, but you can turn ads on or off in the settings.</p>
      <button class="show-ads" onclick={allowAds}>
        <Check />
        I am 13+, show me ads
      </button>
      <button class="no-ads" onclick={disallowAds}>
        <Cross />
        No ads for me, thanks
      </button>
      <button onclick={doBuyMeACoffee}>Tip the developer</button>
      <a href="#" onclick={showPrivacy}>View privacy policy</a>
    </div>
  </div>
{/if}

{#if app.showAds && app.adInitComplete }
  <div class="ads">
    <BannerAd />
  </div>
{/if}

<style lang="scss">
  @use "variables" as *;

  :global(body, html) {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: $blue-deep;
  }

  nav {
    $top-status-bar: 32px;

    display: flex;
    flex-direction: row;
    background: $blue-dark;
    margin-top: $top-status-bar;

    .nav-button {
      $size: 48px;
      width: $size;
      height: $size;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      border: 1px solid transparent;

      &.selected {
        background: $blue-vibrant;
        border: 1px solid $border-color;
      }

      &.disabled {
        opacity: 25%;
      }

      .icon {
        position: absolute;
        top: 0;
        left: 0;
        width: $size;
        height: $size;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.hidden {
          opacity: 0;
        }

        &.blink {
          animation: blink 1s infinite;
        }
      }
    }
  }

  :global(nav svg) {
    stroke: $text-light;
    width: 32px;
    height: 32px;
  }

  main {
    padding: $spacing-2 $spacing-2;
    flex-grow: 1;
  }

  .dialog-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 60%);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .dialog {
      margin: $spacing-4 0;

      display: flex;
      flex-direction: column;
      background: $blue-dark;
      border: 1px solid $border-color;
      padding: $spacing-2 $spacing-1;
      border-radius: $radius-md;
      width: 85%;
      max-height: 90vh;
      overflow-y: auto;
      word-break: break-word;

      h3 {
        margin-top: $spacing-4;
      }

      ul {
        margin-left: $spacing-3;

        li {
          margin: $spacing-1 0;
        }
      }

      button {
        margin: $spacing-1 $spacing-3;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: $spacing-2;
      }

      a {
        margin-top: $spacing-1;
        text-align: center;
      }

      .thanks {
        margin: $spacing-4 0;
      }
    }
  }

  .ads {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #000;
    height: 100px;
    justify-self: flex-end;
  }

  :global(button.show-ads svg) {
    stroke: $accent-low;
  }

  :global(button.no-ads svg) {
    stroke: $accent-high;
  }
</style>
