import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button'; // Adjust path if necessary
import { describe, it, expect } from 'vitest';

describe('Button component', () => {
  it('should render the button with children text', () => {
    const buttonText = 'Click Me';
    render(<Button>{buttonText}</Button>);

    // Use screen.getByText which is recommended
    expect(screen.getByText(buttonText)).toBeInTheDocument(); 
  });

  it('should apply default variant styles', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /Default Button/i });
    // Example check: Check for a class associated with the default variant
    // Note: This depends heavily on the implementation details of your Button and variants
    // You might need to adjust the class name based on `buttonVariants` in `button.tsx`
    expect(buttonElement).toHaveClass('bg-primary'); 
  });

  it('should apply specified variant styles (e.g., outline)', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /Outline Button/i });
     // Check for a class associated with the outline variant
    expect(buttonElement).toHaveClass('border');
    expect(buttonElement).toHaveClass('border-input'); 
  });
});
