export function createResumePrompt(role: string, bio: string) {
  return `
You are a career consultant.

Create a tailored resume and cover letter for the following role:
Role: ${role}

Candidate Bio:
${bio}

Resume format:
- Summary
- Skills
- Work Experience
- Education

Cover letter format:
- Header
- Intro
- Why this role
- Closing statement

Keep it concise, clear, and professional.
`.trim();
}