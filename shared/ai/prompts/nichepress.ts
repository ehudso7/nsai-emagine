export function createBlogPrompt(niche: string) {
  return `
You are an SEO expert and blog content writer.

Generate 5 long-form blog article titles and full post drafts (500-800 words each) for a niche blog about: "${niche}"

Each post should include:
- A compelling title
- Engaging introduction
- Useful, niche-specific tips
- A clear conclusion
- SEO-friendly metadata (title tag + meta description)

Format each post cleanly and clearly.
`.trim();
}