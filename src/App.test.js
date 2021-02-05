import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Submitted', () => {
  render(<App />);
  const linkElement = screen.getByText(/Plain Submitted/i);
  expect(linkElement).toBeInTheDocument();
});
