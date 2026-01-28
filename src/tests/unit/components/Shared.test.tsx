/**
 * Shared Components Tests
 * 
 * Tests for Modal, IconButton, and Toggle components.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, IconButton, Toggle } from '../../../components/Shared';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
  };

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closeOnEscape is false', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} closeOnEscape={false} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Click on the overlay (the element with bg-black/50)
    const overlay = container.querySelector('.bg-black\\/50');
    if (overlay) {
      await userEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onClose when clicking inside modal', async () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    await userEvent.click(screen.getByText('Modal content'));
    
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  const TestIcon = () => (
    <svg data-testid="test-icon" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
    </svg>
  );

  it('renders with icon and aria-label', () => {
    render(<IconButton aria-label="Test button" icon={<TestIcon />} />);
    
    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { rerender } = render(
      <IconButton aria-label="Test" icon={<TestIcon />} variant="default" />
    );
    expect(screen.getByRole('button')).toHaveClass('bg-gray-100');

    rerender(<IconButton aria-label="Test" icon={<TestIcon />} variant="primary" />);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-500');

    rerender(<IconButton aria-label="Test" icon={<TestIcon />} variant="danger" />);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');

    rerender(<IconButton aria-label="Test" icon={<TestIcon />} variant="ghost" />);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <IconButton aria-label="Test" icon={<TestIcon />} size="sm" />
    );
    expect(screen.getByRole('button')).toHaveClass('min-h-[32px]');

    rerender(<IconButton aria-label="Test" icon={<TestIcon />} size="md" />);
    expect(screen.getByRole('button')).toHaveClass('min-h-[44px]');

    rerender(<IconButton aria-label="Test" icon={<TestIcon />} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('min-h-[52px]');
  });

  it('handles disabled state', () => {
    render(<IconButton aria-label="Test" icon={<TestIcon />} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('calls onClick handler', async () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Test" icon={<TestIcon />} onClick={onClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Test toggle" />);
    
    expect(screen.getByRole('switch')).toBeInTheDocument();
    // Label appears in both sr-only span and visible label
    expect(screen.getAllByText('Test toggle').length).toBeGreaterThanOrEqual(1);
  });

  it('has correct ARIA attributes when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Test toggle" />);
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('has correct ARIA attributes when checked', () => {
    render(<Toggle checked={true} onChange={() => {}} label="Test toggle" />);
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Test toggle" />);
    
    await userEvent.click(screen.getByRole('switch'));
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with opposite value', async () => {
    const onChange = vi.fn();
    render(<Toggle checked={true} onChange={onChange} label="Test toggle" />);
    
    await userEvent.click(screen.getByRole('switch'));
    
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('toggles on Space key', () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Test toggle" />);
    
    const toggle = screen.getByRole('switch');
    fireEvent.keyDown(toggle, { key: ' ' });
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Enter key', () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Test toggle" />);
    
    const toggle = screen.getByRole('switch');
    fireEvent.keyDown(toggle, { key: 'Enter' });
    
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} label="Test toggle" disabled />);
    
    await userEvent.click(screen.getByRole('switch'));
    
    expect(onChange).not.toHaveBeenCalled();
  });

  it('hides label visually when labelHidden is true', () => {
    render(<Toggle checked={false} onChange={() => {}} label="Test toggle" labelHidden />);
    
    // When labelHidden is true, the visible label should have sr-only class
    const labels = screen.getAllByText('Test toggle');
    const visibleLabel = labels.find(el => el.tagName === 'LABEL');
    expect(visibleLabel).toHaveClass('sr-only');
  });

  it('applies size styles', () => {
    const { rerender } = render(
      <Toggle checked={false} onChange={() => {}} label="Test" size="sm" />
    );
    expect(screen.getByRole('switch')).toHaveClass('h-5', 'w-9');

    rerender(<Toggle checked={false} onChange={() => {}} label="Test" size="md" />);
    expect(screen.getByRole('switch')).toHaveClass('h-6', 'w-11');

    rerender(<Toggle checked={false} onChange={() => {}} label="Test" size="lg" />);
    expect(screen.getByRole('switch')).toHaveClass('h-7', 'w-14');
  });

  it('applies checked styles', () => {
    const { rerender } = render(
      <Toggle checked={false} onChange={() => {}} label="Test" />
    );
    expect(screen.getByRole('switch')).toHaveClass('bg-gray-300');

    rerender(<Toggle checked={true} onChange={() => {}} label="Test" />);
    expect(screen.getByRole('switch')).toHaveClass('bg-blue-500');
  });
});
