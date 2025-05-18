import { sendMail } from '@/shared/lib/mailer';

const tasks = [
  {
    type: 'check-in-reminder',
    email: 'guest1@email.com',
    name: 'Guest1',
    checkInTime: '3:00 PM',
    code: '8274#',
    unit: 'Unit A'
  },
  {
    type: 'cleaner-notify',
    cleanerEmail: 'cleaningteam@example.com',
    unit: 'Unit A',
    checkoutTime: '11:00 AM'
  }
];

async function main() {
  for (const task of tasks) {
    switch (task.type) {
      case 'check-in-reminder':
        await sendMail({
          to: task.email,
          subject: `Check-In Reminder for ${task.unit}`,
          text: `Hi ${task.name},\n\nThis is a reminder that check-in is at ${task.checkInTime}. Your smart lock code is: ${task.code}.\n\nEnjoy your stay!`
        });
        break;

      case 'cleaner-notify':
        await sendMail({
          to: task.cleanerEmail,
          subject: `New Checkout – ${task.unit}`,
          text: `A guest checked out of ${task.unit} at ${task.checkoutTime} today. It's ready for cleaning.`
        });
        break;
    }
  }
}

main();