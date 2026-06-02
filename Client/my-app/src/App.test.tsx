import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home navigation link', () => {
  render(<App />);
  expect(screen.getByText('דף הבית')).toBeInTheDocument();
});
