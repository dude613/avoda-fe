import React from 'react';
import SentryTestButton from '@/components/SentryTestButton'; // Assuming this path is correct based on project structure

const DebugPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Debug Tools</h1>
      <p style={{ margin: '20px 0' }}>Use the button below to test Sentry error reporting.</p>
      <SentryTestButton />
    </div>
  );
};

export default DebugPage;
