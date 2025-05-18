export async function publishToCMS({ content, user }: { content: string; user: { email: string } }) {
  // Simulate CMS integration (WordPress, Ghost, etc.)
  console.log(`Publishing content for ${user.email}:\n\n${content}`);
}