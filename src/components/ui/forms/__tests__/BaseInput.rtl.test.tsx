import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseInput from '../BaseInput';
import { renderWithRtl, renderWithLtr } from '../../../../utils/__tests__/rtl-test-utils';

// Mock Icons for testing
const TestIcon = () => <div data-testid="test-icon">icon</div>;
const TestPrefix = () => <div data-testid="test-prefix">€</div>;
const TestSuffix = () => <div data-testid="test-suffix">.00</div>;

describe('BaseInput - RTL Support', () => {
  test('should render correctly in RTL mode', () => {
    renderWithRtl(
      <BaseInput
        id="test-input"
        label="Test Label"
        placeholder="Test Placeholder"
      />
    );
    
    // Get elements
    const input = screen.getByPlaceholderText('Test Placeholder');
    const container = input.closest('div[dir="rtl"]');
    
    // Check RTL direction attribute
    expect(container).toHaveAttribute('dir', 'rtl');
    
    // Check RTL text alignment
    expect(input).toHaveStyle('text-align: right');
  });
  
  test('should render correctly in LTR mode', () => {
    renderWithLtr(
      <BaseInput
        id="test-input"
        label="Test Label"
        placeholder="Test Placeholder"
      />
    );
    
    // Get elements
    const input = screen.getByPlaceholderText('Test Placeholder');
    const container = input.closest('div[dir="ltr"]');
    
    // Check LTR direction attribute
    expect(container).toHaveAttribute('dir', 'ltr');
    
    // Check LTR text alignment
    expect(input).toHaveStyle('text-align: left');
  });
  
  test('should position icon correctly in RTL mode', () => {
    renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        icon={<TestIcon />}
      />
    );
    
    // Get elements
    const icon = screen.getByTestId('test-icon');
    const iconWrapper = icon.closest('div');
    
    // In RTL, icon should be on the right
    expect(iconWrapper).toHaveClass('iconWrapperRtl');
    expect(iconWrapper).not.toHaveClass('iconWrapper');
  });
  
  test('should position icon correctly in LTR mode', () => {
    renderWithLtr(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        icon={<TestIcon />}
      />
    );
    
    // Get elements
    const icon = screen.getByTestId('test-icon');
    const iconWrapper = icon.closest('div');
    
    // In LTR, icon should be on the left
    expect(iconWrapper).toHaveClass('iconWrapper');
    expect(iconWrapper).not.toHaveClass('iconWrapperRtl');
  });
  
  test('should position prefix correctly in RTL mode', () => {
    renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        prefix={<TestPrefix />}
      />
    );
    
    // Get elements
    const prefix = screen.getByTestId('test-prefix');
    const prefixWrapper = prefix.closest('div');
    
    // In RTL, prefix should be on the right
    expect(prefixWrapper).toHaveClass('prefixRtl');
    expect(prefixWrapper).not.toHaveClass('prefix');
  });
  
  test('should position suffix correctly in RTL mode', () => {
    renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        suffix={<TestSuffix />}
      />
    );
    
    // Get elements
    const suffix = screen.getByTestId('test-suffix');
    const suffixWrapper = suffix.closest('div');
    
    // In RTL, suffix should be on the left
    expect(suffixWrapper).toHaveClass('suffixRtl');
    expect(suffixWrapper).not.toHaveClass('suffix');
  });
  
  test('should position validation indicators correctly in RTL mode', () => {
    const { rerender } = renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        validating={true}
      />
    );
    
    // Check validation spinner
    const spinner = screen.getByRole('status') || document.querySelector('.spinner')?.parentElement;
    expect(spinner).toHaveClass('validatingRtl');
    expect(spinner).not.toHaveClass('validating');
    
    // Rerender with valid state
    rerender(
      <BaseInput
        id="test-input"
        placeholder="Test Placeholder"
        valid={true}
      />
    );
    
    // Check valid indicator
    const checkIcon = document.querySelector('.checkIcon')?.parentElement;
    expect(checkIcon).toHaveClass('validIconRtl');
    expect(checkIcon).not.toHaveClass('validIcon');
  });
  
  test('should have correct padding in RTL mode with icons and prefixes', () => {
    const { rerender } = renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Test with Icon"
        icon={<TestIcon />}
      />
    );
    
    // Get input element
    let input = screen.getByPlaceholderText('Test with Icon');
    let inputContainer = input.closest('.inputContainer');
    
    // In RTL with icon, input should have padding on the right
    expect(inputContainer).toHaveClass('hasIcon');
    
    // Rerender with prefix
    rerender(
      <BaseInput
        id="test-input"
        placeholder="Test with Prefix"
        prefix={<TestPrefix />}
      />
    );
    
    // Get input element
    input = screen.getByPlaceholderText('Test with Prefix');
    inputContainer = input.closest('.inputContainer');
    
    // In RTL with prefix, input should have padding on the right
    expect(inputContainer).toHaveClass('hasPrefix');
    
    // Rerender with suffix
    rerender(
      <BaseInput
        id="test-input"
        placeholder="Test with Suffix"
        suffix={<TestSuffix />}
      />
    );
    
    // Get input element
    input = screen.getByPlaceholderText('Test with Suffix');
    inputContainer = input.closest('.inputContainer');
    
    // In RTL with suffix, input should have padding on the left
    expect(inputContainer).toHaveClass('hasSuffix');
  });
  
  test('should handle required label correctly in RTL mode', () => {
    renderWithRtl(
      <BaseInput
        id="test-input"
        label="Required Field"
        required={true}
      />
    );
    
    // Get label element
    const label = screen.getByText('Required Field');
    
    // Label should have required class
    expect(label).toHaveClass('required');
    
    // The container should have RTL direction
    const container = label.closest('div[dir="rtl"]');
    expect(container).toHaveAttribute('dir', 'rtl');
  });
  
  test('should handle RTL input interactions correctly', () => {
    const handleChange = jest.fn();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    const handleIconClick = jest.fn();
    
    renderWithRtl(
      <BaseInput
        id="test-input"
        placeholder="Interactive Test"
        icon={<TestIcon />}
        iconClickable={true}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onIconClick={handleIconClick}
      />
    );
    
    // Get elements
    const input = screen.getByPlaceholderText('Interactive Test');
    const icon = screen.getByTestId('test-icon');
    
    // Test focus behavior
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();
    
    // Test change behavior
    fireEvent.change(input, { target: { value: 'Test Value' } });
    expect(handleChange).toHaveBeenCalled();
    
    // Test blur behavior
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
    
    // Test icon click behavior
    fireEvent.click(icon);
    expect(handleIconClick).toHaveBeenCalled();
  });
});