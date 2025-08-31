<script lang="ts">
  import { browser } from "$app/environment"
  import { MetaTags } from "svelte-meta-tags"
</script>

<MetaTags
  title="Our Roadmap - Nanowrit Labs"
  description="Explore the future of Nanowrit Labs, an end-to-end ecosystem for story development, audience building, and production."
  openGraph={{
    type: "website",
    url: browser ? window.location.href : "https://nanowritlabs.com/roadmap",
    title: "Our Roadmap - Nanowrit Labs",
    description:
      "Our vision for building a modern studio for creators, from our core Narrative Graph engine to producer services.",
  }}
/>

<div class="container mx-auto px-4 py-8 sm:py-12 bg-base-100 text-base-content">
  <h1 class="text-3xl sm:text-4xl font-bold text-center mb-4">
    Our Roadmap: Engineering the Modern Creator Studio
  </h1>
  <p
    class="text-lg text-center text-base-content/80 max-w-3xl mx-auto mb-10 sm:mb-16"
  >
    We're building an end-to-end ecosystem to guide creators from initial
    concept to a fully produced project. Our mission is to combine a powerful
    development platform—built on a proprietary <span
      class="font-semibold text-primary">Narrative Graph</span
    >—with expert producer services. Here’s our plan to build the future of IP
    development.
  </p>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
    <div
      class="card bg-base-200 shadow-lg p-6 transition-shadow hover:shadow-xl"
    >
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2 border-primary">
        🚀 Live Now: The Narrative Graph
      </h2>
      <p class="mb-4 text-base-content/80">
        The core of our platform—a knowledge graph for your story world:
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <span class="font-semibold text-primary">Dynamic World-Building:</span
          > Create any element (characters, locations, items) as a node in your story's
          graph.
        </li>
        <li>
          <span class="font-semibold text-primary"
            >Relational Storytelling:</span
          > Define complex relationships between elements (e.g., "Ally Of," "Located
          In," "Forged At").
        </li>
        <li>
          <span class="font-semibold text-primary"
            >Centralized IP Management:</span
          > A single source of truth for your entire canon.
        </li>
        <li>Rich Text & Asset Uploads</li>
        <li>Team Creation & Collaboration</li>
        <li>Community Hub Access via Discord</li>
      </ul>
    </div>

    <div
      class="card bg-base-200 shadow-lg p-6 transition-shadow hover:shadow-xl"
    >
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2 border-secondary">
        🛠️ Near-Term: The Canon Engine
      </h2>
      <p class="mb-4 text-base-content/80">
        Enhancing the graph to track your story's evolution:
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <span class="font-semibold text-primary">Canon Version Control:</span>
          Track changes to elements and relationships over time, creating a verifiable
          history of your world.
        </li>
        <li>Enhanced Graph Visualization Tools</li>
        <li>
          <span class="font-semibold text-primary">AI Co-Pilot:</span> Concept
          Image Generation
          <span class="badge badge-primary badge-outline text-xs ml-1"
            >Producer+</span
          >
        </li>
        <li>In-App Commenting & Feedback Loops</li>
        <li>Professional Project Export (PDF, Markdown)</li>
      </ul>
    </div>

    <div
      class="card bg-base-200 shadow-lg p-6 transition-shadow hover:shadow-xl"
    >
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2 border-accent">
        ✨ Longer-Term: The Full Studio
      </h2>
      <p class="mb-4 text-base-content/80">
        Leveraging the platform to produce world-class IP:
      </p>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <span class="font-semibold text-primary"
            >Executive Producer Services:</span
          > We'll partner with the most promising projects on our platform to provide
          funding and production expertise.
        </li>
        <li>
          <span class="font-semibold text-primary">Narrative Analytics:</span> AI-powered
          insights derived from your graph to identify audience engagement opportunities
          and potential plot holes.
        </li>
        <li>
          <span class="font-semibold text-primary">Virtual Studio System:</span>
          A library of virtual assets that connect directly to your narrative graph
          for pre-visualization.
        </li>
        <li>Advanced Collaboration & Pitch Package Assembly</li>
      </ul>
    </div>
  </div>

  <div class="text-center bg-base-300 p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Shape Our Vision!</h2>
    <p class="mb-6 text-base-content/80 max-w-2xl mx-auto">
      This roadmap is a living document, guided by our vision and <span
        class="font-semibold text-primary">your feedback</span
      >. Join our community on Discord to discuss these features, suggest new
      ideas, and help us prioritize what matters most to the next generation of
      creators.
    </p>
    <a
      href="https://discord.gg/xNNDvNkKAS"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary"
    >
      Join our Discord Community
    </a>
    <a href="/contact_us" class="btn btn-ghost ml-4">Suggest a Feature</a>
  </div>

  <p class="text-center text-sm italic text-base-content/60 mt-8">
    Please note: This roadmap outlines our current plans and aspirations.
    Priorities and timelines may shift based on ongoing development, user
    feedback, and market conditions. Our producer services will be offered to
    select projects developed on the platform.
  </p>
</div>
