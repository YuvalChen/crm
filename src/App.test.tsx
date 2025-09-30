import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CRM system', () => {
  render(<App />);
  const titleElement = screen.getByText(/CRM System/i);
  expect(titleElement).toBeInTheDocument();
});
