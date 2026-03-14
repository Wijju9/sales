import { render, screen } from '@testing-library/react';
import App from './App';

test('renders sales dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /sales dashboard/i });
  expect(headingElement).toBeInTheDocument();
});
