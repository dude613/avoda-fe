import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming Button component exists at this path

const SentryTestButton: React.FC = () => {
  const triggerError = () => {
    try {
      // Intentionally throw an error to test Sentry
      throw new Error('Sentry Test Error: Button Clicked!');
    } catch (error) {
      // Log locally for immediate feedback, Sentry should still capture it via global handlers
      console.error("Caught test error locally:", error);
      // Optionally, explicitly capture if global handlers don't pick it up reliably:
      // import * as Sentry from "@sentry/react";
      // Sentry.captureException(error);
    }
  };

  return (
    <Button variant="destructive" onClick={triggerError}>
      Trigger Sentry Test Error
    </Button>
  );
};

export default SentryTestButton;
