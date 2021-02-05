import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Form', () => {
  render(<App />);
  const linkElement = screen.getByText(/Form/i);
  expect(linkElement).toBeInTheDocument();
});
