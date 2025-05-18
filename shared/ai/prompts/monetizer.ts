export function createMonetizationPrompt(niche: string, content: string) {
  return `
You are a monetization strategist.

The user writes content in the niche: ${niche}.
Here is a blog/article/sample:

${content}

Suggest:
- Affiliate product categories to promote
- Digital product ideas (e.g. PDF guide, video course)
- CTA (call to action) examples for end of blog posts
  `.trim();
}