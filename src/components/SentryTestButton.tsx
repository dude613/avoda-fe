import React from 'react';
import * as Sentry from "@sentry/react"; // Import Sentry
import { Button } from '@/components/ui/button'; // Assuming Button component exists at this path

const SentryTestButton: React.FC = () => {
  const triggerError = () => {
    try {
      // Intentionally throw an error to test Sentry
      throw new Error('Sentry Test Error: Button Clicked!');
    } catch (error) {
      // Explicitly capture the exception to ensure it's sent to Sentry
      Sentry.captureException(error);
    }
  };

  return (
    <Button variant="destructive" onClick={triggerError}>
      Trigger Sentry Test Error
    </Button>
  );
};

export default SentryTestButton;
