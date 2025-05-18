export function createGrantSearchPrompt(keyword: string) {
  return `
You are a professional grant researcher.

Search for and summarize up to 5 active government grants related to the following topic: "${keyword}".

For each grant, include:
- Title
- Funding agency
- Eligibility criteria
- Application deadline
- Website link

Use U.S. federal, state, or local sources. Present the info clearly.
`.trim();
}