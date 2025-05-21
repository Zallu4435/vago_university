import { useState } from 'react';
import CommunicationTabs from './CommunicationTabs';
import InboxSection from './InboxSection';
import SentSection from './SentSection';

export default function Communication() {
  const [activeTab, setActiveTab] = useState('Inbox');

  // Inbox messages
  const inboxMessages = [
    {
      id: 1,
      sender: 'Financial Aid Office',
      email: 'financial.aid@university.edu',
      subject: 'Scholarship Awarded - Your application has been approved',
      date: 'April 30, 2025',
      time: '10:32AM',
      content: [
        'Dear John Smith,',
        'We are pleased to inform you that you have been awarded the Academic Excellence Scholarship for the 2025-2028 academic year. This scholarship will provide $5,000 towards your tuition and fees.',
        'The scholarship funds will be applied to your student account by May 15, 2025.',
        'Please log into the Financial Services section to review the details and acknowledge receipt of this award.',
        'Congratulations on your achievement!',
        'Sincerely,',
        'University Financial Aid Office'
      ],
      icon: 'FA',
      color: 'bg-orange-500',
      unread: true,
    },
    {
      id: 2,
      sender: 'Academic Department',
      email: 'academics@university.edu',
      subject: 'Course Registration Reminder - Please complete by May 15',
      date: 'April 29, 2025',
      time: 'Yesterday',
      content: [
        'Dear John Smith,',
        'This is a reminder to complete your course registration for the Fall 2025 semester by May 15, 2025.',
        'Please log into the Academics section to select your courses.',
        'Best regards,',
        'Academic Department'
      ],
      icon: 'AD',
      color: 'bg-green-500',
      unread: true,
    },
    {
      id: 3,
      sender: 'Housing Department',
      email: 'housing@university.edu',
      subject: 'Room Assignment Update - Your housing request has been processed',
      date: 'April 28, 2025',
      time: 'Apr 28',
      content: [
        'Dear John Smith,',
        'Your housing request for the 2025-2026 academic year has been processed.',
        'You have been assigned to Room 305 in West Hall.',
        'Please contact us if you have any questions.',
        'Sincerely,',
        'Housing Department'
      ],
      icon: 'HD',
      color: 'bg-yellow-500',
      unread: true,
    },
    {
      id: 4,
      sender: 'IT Services',
      email: 'it.support@university.edu',
      subject: 'System Maintenance Notice - The student portal will be unavailable on May 10',
      date: 'April 24, 2025',
      time: 'Apr 24',
      content: [
        'Dear John Smith,',
        'The student portal will undergo scheduled maintenance on May 10, 2025, from 12:00 AM to 6:00 AM.',
        'During this time, the portal will be unavailable.',
        'We apologize for any inconvenience.',
        'Best regards,',
        'IT Services'
      ],
      icon: 'IT',
      color: 'bg-gray-500',
      unread: false,
    },
  ];

  // Sent messages
  const sentMessages = [
    {
      id: 1,
      recipient: 'To: Academic Advisor',
      email: 'advisor@university.edu',
      subject: 'Course Registration Question - I\'m trying to register for the Computer Science seminar',
      date: 'April 29, 2025',
      time: '3:45 PM',
      content: [
        'Dear Academic Advisor,',
        'I\'m trying to register for the Computer Science seminar (CS 450) for the Fall 2025 semester, but I\'m receiving an error message saying I don\'t meet the prerequisites. I believe I\'ve completed all required courses.',
        'Could you please review my record and advise on how to proceed?',
        'Thank you for your help!',
        'Sincerely,',
        'John Smith'
      ],
      icon: 'JS',
      color: 'bg-blue-500',
      reply: {
        title: 'Reply received from advisor@university.edu - April 30, 2025 9:15 AM',
        content: 'I\'ve checked your records and you\'re missing CS 325, which is a prerequisite. Would you like to enroll in CS 325 for the summer session?'
      },
      replyDraft: 'Yes, I would like to enroll in CS 325 for the summer session. Could you please help me with the registration process?'
    },
    {
      id: 2,
      recipient: 'To: Housing Department',
      email: 'housing@university.edu',
      subject: 'Room Change Request - Due to my medical condition, I need to request a room change',
      date: 'April 22, 2025',
      time: 'Apr 22',
      content: [
        'Dear Housing Department,',
        'Due to my medical condition, I need to request a room change for the 2025-2026 academic year.',
        'Please let me know the process for submitting this request.',
        'Thank you,',
        'John Smith'
      ],
      icon: 'JS',
      color: 'bg-blue-500',
    },
    {
      id: 3,
      recipient: 'To: IT Support',
      email: 'it.support@university.edu',
      subject: 'Password Reset Request - I need help resetting my student portal password',
      date: 'April 15, 2025',
      time: 'Apr 15',
      content: [
        'Dear IT Support,',
        'I need help resetting my student portal password.',
        'Please provide instructions for the reset process.',
        'Best regards,',
        'John Smith'
      ],
      icon: 'JS',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800">Communication Center</h2>
        <div className="text-sm text-gray-600">
          3 Unread Messages | Last Checked: April 29, 2025 | Connected Accounts: 2
        </div>
      </div>
      <CommunicationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'Inbox' && <InboxSection messages={inboxMessages} />}
      {activeTab === 'Sent' && <SentSection messages={sentMessages} />}
    </div>
  );
}