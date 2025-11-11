<script lang="ts">
  import WaitlistModal from "$lib/components/WaitlistModal.svelte"
  import {
    WebsiteName,
    // WebsiteBaseUrl,
    // WebsiteDescription,
  } from "./../../config"
  import type { PageData } from "./$types"

  export let data: PageData

  // SEO
  // const ldJson = {
  // "@context": "https://schema.org",
  // "@type": "WebSite",
  //   name: WebsiteName,
  //   url: WebsiteBaseUrl,
  // }
  // const jsonldScript = `<script type="application/ld+json">${
  //   JSON.stringify(ldJson) + "<"
  // }/script>`
</script>

<svelte:head>
  <title>{WebsiteName} - The Community-Greenlit Studio</title>
  <meta
    name="description"
    content="Stop pitching to gatekeepers. We provide the tools to test your idea, find your audience, and get your project funded by a community of backers."
  />
  <!-- {@html jsonldScript} -->
</svelte:head>

{#if !data.session}
  <WaitlistModal />
{/if}

<div class="hero min-h-[70vh] bg-base-200">
  <div class="hero-content text-center py-16 px-4">
    <div class="max-w-3xl">
      <h1 class="text-4xl md:text-6xl font-bold mb-4" style="line-height: 1.2;">
        Stop Pitching Gatekeepers.
        <span class="text-primary">Find Your Fans.</span>
        <span class="text-info">Get Your Project Greenlit.</span>
      </h1>

      <p class="py-6 text-lg md:text-xl text-base-content/80">
        {WebsiteName} is a community-greenlit production studio.
      </p>
      <p
        class="mt-0 pt-0 text-lg md:text-xl text-base-content/80 max-w-xl mx-auto"
      >
        Creatives join for free to develop and test their ideas. Backers
        (Producers & EPs) subscribe to fill a collective Production Fund and
        vote on what gets made.
      </p>

      <div
        class="mt-6 md:mt-8 flex flex-row flex-wrap gap-4 place-content-center"
      >
        <a href="/join" class="btn btn-primary btn-lg px-8 shadow-lg">
          Join the Waitlist
        </a>
        <a href="#how-it-works" class="btn btn-ghost btn-lg px-8">
          See How It Works
        </a>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto px-4 py-16 sm:py-24 space-y-24">
  <section id="how-it-works" class="text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-12">
      The Community Greenlight Model
    </h2>

    <ul class="steps steps-vertical lg:steps-horizontal w-full text-left">
      <li class="step step-primary">
        <div class="p-4">
          <h3 class="font-semibold text-lg">
            1. Creatives Test Ideas (For Free)
          </h3>
          <p class="text-sm text-base-content/70">
            You get free access to our pro-level story tools. Instead of just
            writing on spec, test your ideas in public. Release low-cost content
            (a webcomic, a short, a podcast, etc.) to a real-world audience. Use
            their feedback to refine your project and prove it's a hit.
          </p>
        </div>
      </li>

      <li class="step step-primary">
        <div class="p-4">
          <h3 class="font-semibold text-lg">
            2. Backers Fund the Co-op (With Votes)
          </h3>
          <p class="text-sm text-base-content/70">
            Producers & EPs subscribe annually. 100% of their subscription goes
            into a collective <strong>Production Fund</strong>. This isn't a
            donation—it buys them voting power (5 votes for Producers, 10 for
            EPs) to decide how that Fund is spent.
          </p>
        </div>
      </li>

      <li class="step step-secondary">
        <div class="p-4">
          <h3 class="font-semibold text-lg">
            3. The Community Votes to Greenlight
          </h3>
          <p class="text-sm text-base-content/70">
            With a validated concept, a Creative can pitch for a real budget
            (e.g., $25k for an animated pilot). The Producers—our collective of
            paid members—vote on the proposal. If it passes, the project is
            greenlit. No gatekeepers, no spec scripts. Just a direct path from
            idea to production.
          </p>
        </div>
      </li>

      <li class="step step-accent">
        <div class="p-4">
          <h3 class="font-semibold text-lg">4. We Produce, You Get Paid</h3>
          <p class="text-sm text-base-content/70">
            We are the studio. Our team manages the budget, hiring, legal, and
            distribution. All project revenue is split 50/50. 50% goes to the
            Creative. 50% goes back into the Production Fund to help pay for the
            next project.
          </p>
        </div>
      </li>
    </ul>
  </section>

  <section class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
    <div
      class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow p-6 lg:p-8"
    >
      <h2 class="text-3xl font-bold mb-4">For CREATIVES</h2>
      <p class="text-lg text-base-content/80 mb-6">
        Get free tools, de-risk your idea, and find a direct path to funding.
      </p>
      <ul class="space-y-3">
        <li class="flex items-start">
          <span class="text-primary mr-3 mt-1">✓</span>
          <span
            ><strong>Free World-Building:</strong> Use our pro-level story development
            tools for free, forever.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3 mt-1">✓</span>
          <span
            ><strong>Test Your Ideas:</strong> Go from concept to investor-ready
            IP by building a real-world audience hungry for what you come up with
            next.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3 mt-1">✓</span>
          <span
            ><strong>Get Funded, Not Pitched:</strong> Stop sending query letters.
            Recruit your fans, build your case, and submit your project for a community
            greenlight vote.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3 mt-1">✓</span>
          <span
            ><strong>A Real Production Partner:</strong> When you're greenlit, we
            are your production team. You focus on the creative, we handle the business.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-primary mr-3 mt-1">✓</span>
          <span
            ><strong>Keep Your IP & Get Paid:</strong> You retain ownership of your
            IP and get a 50% revenue share on all projects we produce together.</span
          >
        </li>
      </ul>
      <a href="/join" class="btn btn-primary btn-outline mt-8">
        Start Building for Free
      </a>
    </div>

    <div class="card bg-base-300 shadow-inner p-6 lg:p-8">
      <h2 class="text-3xl font-bold mb-4">For BACKERS</h2>
      <p class="text-lg text-base-content/80 mb-6">
        Stop being a patron. Start being a producer.
      </p>
      <ul class="space-y-3">
        <li class="flex items-start">
          <span class="text-info mr-3 mt-1">✓</span>
          <span
            ><strong>You Give the Greenlight:</strong> Your subscription isn't a
            fee, it's power. You (and the rest of our Producers) have 100% control
            over what gets made.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-info mr-3 mt-1">✓</span>
          <span
            ><strong>You Get the Credit:</strong> You're a producer, so you get the
            credit. Backers are featured in the credits of every project they help
            fund, including potential IMDb credits for film and TV productions.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-info mr-3 mt-1">✓</span>
          <span
            ><strong>Wield Your Influence:</strong> As a Producer (5 votes) or EP
            (10 votes), you decide how to back projects. Go all-in to champion a
            single pitch, or spread your votes across multiple projects you believe
            in. It's a strategic role: you can support a commercial hit that grows
            the fund, which gives your favorite creators more shots at a greenlight.</span
          >
        </li>
        <li class="flex items-start">
          <span class="text-info mr-3 mt-1">✓</span>
          <span
            ><strong>The Fund Refills Itself:</strong> When a project is successful,
            50% of its revenue goes back into the Production Fund, stretching your
            subscription dollars to greenlight even more projects.</span
          >
        </li>
      </ul>
      <a href="/pricing" class="btn btn-info mt-8"> View Backer Tiers </a>
    </div>
  </section>

  <section class="text-center pt-8">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      Ready to Build Your Universe?
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
      Join the waitlist for Nanowrit Labs. Whether you're a creator ready to
      build or a backer ready to produce, your studio is waiting.
    </p>
    <a href="/join" class="btn btn-primary btn-lg px-10 shadow-lg">
      Join the Waitlist
    </a>
  </section>
</div>
