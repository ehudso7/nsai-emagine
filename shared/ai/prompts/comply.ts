export function createPolicyPrompt({
  businessType,
  dataCollected,
  region
}: {
  businessType: string;
  dataCollected: string[];
  region: string;
}) {
  return `
You are a legal assistant trained in data compliance and GDPR/CCPA.

Generate a complete privacy policy for a ${businessType} that collects the following data:
- ${dataCollected.join('\n- ')}

The business is based in the ${region} and must comply with all relevant privacy regulations.
Use clear and professional legal language.
  `.trim();
}