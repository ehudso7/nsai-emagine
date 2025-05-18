import { runGrantSearch } from './grantScan';

const users = [
  {
    email: 'nonprofit@example.com',
    keyword: 'mental health programs for veterans'
  },
  {
    email: 'artist@collective.org',
    keyword: 'youth community arts'
  }
];

async function main() {
  for (const user of users) {
    const summary = await runGrantSearch(user);
    console.log(`Email sent to ${user.email}:\n${summary}`);
  }
}

main();