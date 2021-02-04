import { render, screen } from '@testing-library/react';
import App from './App';

test('renders short description', () => {
  render(<App />);
  const linkElement = screen.getByText(/short description/i);
  expect(linkElement).toBeInTheDocument();
});
