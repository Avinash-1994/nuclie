<script>
  export let title = 'Svelte Banner';
  export let subtitle = 'This remote MFE is rendered with Svelte.';
</script>

<section class="banner">
  <div class="banner-content">
    <p class="eyebrow">Multi-framework remote</p>
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </div>
</section>

<style>
  .banner {
    padding: 2rem 1.5rem;
    background: linear-gradient(135deg, #f97316, #fb7185);
    color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 60px rgba(249, 115, 22, 0.2);
    margin: 1.5rem 0;
  }

  .banner-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    opacity: 0.9;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    line-height: 1.1;
  }

  p {
    margin: 1rem auto 0;
    max-width: 34rem;
    color: rgba(255, 255, 255, 0.92);
    font-size: 1rem;
    line-height: 1.8;
  }
</style>
