<!-- src/routes/+page.svelte -->
<script lang="ts">
  import WaitlistModal from "$lib/components/WaitlistModal.svelte"
  import {
    WebsiteName,
    WebsiteBaseUrl,
    WebsiteDescription,
  } from "./../../config" // Assuming config is in src/config.ts or similar
  import type { PageData } from "./$types"

  export let data: PageData

  // SEO and JSON-LD setup
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  // Define sections for easier readability
  const sections = [
    {
      title: "Story Development Tools",
      description:
        "Stop wrestling with scattered notes. Our platform provides a structured environment to build your world bible, develop complex characters, and outline your narrative. Go from a simple idea to a fully-realized universe.",
      icon: "🧩", // Placeholder icon
    },
    {
      title: "Audience Development Strategy",
      description:
        "A great story needs a great audience. We guide you to build your project in a way that creates multiple entry points for fans, helping you build a passionate community and validate your concept long before production begins.",
      icon: "🔗", // Placeholder icon
    },
    {
      title: "Create Investable IP",
      description:
        "Move beyond just a script. We help you assemble a professional pitch package, complete with a world bible and an audience engagement strategy, that de-risks your project for investors and partners.",
      icon: "💡", // Placeholder icon
    },
    {
      title: "Executive Producer Services",
      description:
        "The journey doesn't end with a pitch. For the most promising projects developed on our platform, our team of experienced producers will provide the guidance and connections needed to get your project made.",
      icon: "📈", // Placeholder icon
    },
  ]
</script>

<svelte:head>
  <title>{WebsiteName} - From Script to Screen. And Beyond.</title>
  <meta name="description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}
</svelte:head>

{#if !data.session}
  <WaitlistModal />
{/if}

<!-- Hero Section (Your Existing Code - Slightly Enhanced) -->
<div class="hero min-h-[70vh] bg-base-200">
  <div class="hero-content text-center py-16 px-4">
    <div class="max-w-3xl">
      <div
        class="text-lg md:text-xl font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-3 md:mb-5 pb-1"
      >
        From Script to Screen. And Beyond.
      </div>

      <h1 class="text-4xl md:text-6xl font-bold mb-4" style="line-height: 1.2;">
        Develop Your Story.
        <!-- <span class="text-primary">Guided</span> -->
        <span class="text-primary">Build Your Audience.</span>
        <span class="text-info">Get Your Project Made.</span>
      </h1>

      <p class="py-6 text-lg md:text-xl text-base-content/80">
        Nanowrit Labs is an end-to-end development studio that combines powerful
        story-building tools with expert producer services.
      </p>
      <p class="py-6 text-lg md:text-xl text-base-content/80">
        We provide a clear path for creators to transform a script into
        valuable, fundable Intellectual Property.
      </p>

      <div
        class="mt-6 md:mt-8 flex flex-row flex-wrap gap-4 place-content-center"
      >
        <a href="/pricing" class="btn btn-primary btn-lg px-8 shadow-lg">
          Get Started for Free
        </a>
        <a href="/roadmap" class="btn btn-ghost btn-lg px-8"> Our Services </a>
      </div>
    </div>
  </div>
</div>

<!-- Main Content Area -->
<div class="container mx-auto px-4 py-16 sm:py-24 space-y-16 sm:space-y-24">
  <!-- Section 1: The Problem & The IDE Solution -->
  <section class="text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      Tired of Limits? Build Beyond Them.
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-12">
      Nanowrit Labs is more than a writing app - it's an end-to-end development
      studio. We provide the integrated tools to architect your story world and
      the expert guidance to get it produced. Stop just writing stories - start
      building empires.
      <!-- Bringing ambitious, multi-platform stories to life is complex. Scattered
      ideas, creative bottlenecks, and the struggle for validation can stall
      even the best concepts. The
      <span class="font-semibold text-primary">{WebsiteName} IDE</span> provides
      the structure and (future) tools to turn that complexity into your advantage. -->
    </p>
    <!-- Feature/Benefit Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {#each sections as section}
        <div
          class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow p-6 text-left"
        >
          <div class="text-4xl mb-4">{section.icon}</div>
          <h3 class="text-xl font-semibold mb-2">{section.title}</h3>
          <p class="text-base-content/80 text-sm">{section.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Section 2: How it Works (Simplified Workflow) -->
  <!-- <section>
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Your Workflow, Elevated
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-12">
      Our platform is designed to guide you through the modern development
      process, transforming your creative workflow into a strategic asset.
    </p>
    <ul class="steps steps-vertical lg:steps-horizontal w-full">
      <li class="step step-primary">
        <span class="text-left font-semibold"
          >1. Plan & Structure<br /><span
            class="font-normal text-sm text-base-content/70"
            >Define your story, world, characters, and strategy using the Bible
            framework.</span
          ></span
        >
      </li>
      <li class="step step-primary">
        <span class="text-left font-semibold"
          >2. Ideate & Visualize<br /><span
            class="font-normal text-sm text-base-content/70"
            >Upload assets. (Future: Use integrated AI & curated assets to bring
            ideas to life).
          </span></span
        >
      </li>
      <li class="step step-secondary">
        <span class="text-left font-semibold"
          >3. Connect & Engage<br /><span
            class="font-normal text-sm text-base-content/70"
            >Share concepts, gather feedback via Discord, and log insights.</span
          ></span
        >
      </li>
      <li class="step step-accent">
        <span class="text-left font-semibold"
          >4. Iterate & Grow<br /><span
            class="font-normal text-sm text-base-content/70"
            >Refine your vision, build your audience, and develop your
            investable IP.</span
          ></span
        >
      </li>
    </ul>
  </section> -->
  <section>
    <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
      Your Workflow, Elevated
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-12">
      Our platform is designed to guide you through the modern development
      process, transforming your creative workflow into a strategic asset.
    </p>
    <ul class="steps steps-vertical lg:steps-horizontal w-full">
      <li class="step step-primary">
        <div class="lg:px-4">
          <span class="text-left font-semibold"
            >1. Plan & Structure<br /><span
              class="font-normal text-sm text-base-content/70"
              >Build a professional world bible that transforms your story into
              a valuable, expandable IP ready for development.</span
            ></span
          >
        </div>
      </li>
      <li class="step step-primary">
        <div class="lg:px-4">
          <span class="text-left font-semibold"
            >2. Ideate & Visualize<br /><span
              class="font-normal text-sm text-base-content/70"
              >Map your narrative and identify key audience touchpoints, turning
              your story into an immersive, multi-platform experience.</span
            ></span
          >
        </div>
      </li>
      <li class="step step-secondary">
        <div class="lg:px-4">
          <span class="text-left font-semibold"
            >3. Connect & Engage<br /><span
              class="font-normal text-sm text-base-content/70"
              >Share concepts with a target community, gather feedback, and
              begin building a validated audience for your project.</span
            ></span
          >
        </div>
      </li>
      <li class="step step-accent">
        <div class="lg:px-4">
          <span class="text-left font-semibold"
            >4. Iterate & Grow<br /><span
              class="font-normal text-sm text-base-content/70"
              >Refine your vision and assemble a professional pitch package to
              attract investors, partners, and producer services.</span
            ></span
          >
        </div>
      </li>
    </ul>
  </section>

  <!-- Section 3: Built for Visionaries -->
  <section class="text-center bg-base-300 p-8 sm:p-12 rounded-lg shadow-inner">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      Built for the Next Generation of Storytellers
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
      Whether you're a solo creator with a universe in your head, a
      collaborative team building the next big indie game, or a production house
      planning a multi-platform franchise, <span
        class="font-semibold text-primary">our platform and services</span
      > scale with your ambition.
    </p>
    <a
      href="https://discord.gg/xNNDvNkKAS"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-accent"
    >
      Join the Creator Community
    </a>
  </section>

  <!-- Section 4: Future Vision Teaser -->
  <section class="text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      The Future is Integrated
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
      We're actively developing integrated AI tools for accelerated creation and
      the "Virtual Studio System" with curated assets. These powerful features,
      planned for our paid tiers, will further streamline your workflow and
      enhance your creative potential.
    </p>
    <a href="/roadmap" class="btn btn-outline btn-secondary">
      View Our Full Roadmap
    </a>
  </section>

  <!-- Section 5: Final Call to Action -->
  <section class="text-center pt-8">
    <h2 class="text-3xl md:text-4xl font-bold mb-4">
      Ready to Build Your Universe?
    </h2>
    <p class="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto mb-8">
      Join the waitlist for Nanowrit Labs and be the first to access our suite
      of story development tools and producer services.
    </p>
    <a href="/join" class="btn btn-primary btn-lg px-10 shadow-lg">
      Join the Waitlist
    </a>
  </section>
</div>
