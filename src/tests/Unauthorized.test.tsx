import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Unauthorized from '@/pages/Unauthorized'; // Adjust path if necessary
import { describe, it, expect } from 'vitest';

describe('Unauthorized page', () => {
  it('should render the unauthorized heading and message', () => {
    render(
      <Router>
        <Unauthorized />
      </Router>
    );

    // Check for the main heading
    expect(screen.getByRole('heading', { level: 1, name: /403 - Unauthorized/i })).toBeInTheDocument();

    // Check for the descriptive paragraph
    expect(screen.getByText(/You don't have permission to access this page./i)).toBeInTheDocument();

    // Check for the link (optional but good practice)
    expect(screen.getByRole('link', { name: /Go to Dashboard/i })).toBeInTheDocument();
  });
});
