import React from 'react';
import { fireEvent, render, wait as waitFor, cleanup, act } from '@testing-library/react';
import axios from 'axios';
import HeroSection from './HeroSection';

jest.mock('axios');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('../../mui-coffee/context/ThemeContext', () => ({ useTheme: () => ({ isDarkMode: false }) }));
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));
const get = axios.get;
const cup = (id, name, price, extra = {}) => ({
  _id: id, productName: name, productPrice: price, productStatus: 'PROCESS',
  productLeftCount: 10, productImages: ['/uploads/coffee.jpg'], productDesc: `${name} description`, ...extra,
});
afterEach(cleanup);
beforeEach(() => get.mockReset());

it('opens once and switches between real available drinks without closing the sash', async () => {
  get.mockResolvedValue({ data: [
    cup('cake', 'Espresso Cake', 99, { productCollection: 'DESSERT' }),
    cup('sold-out', 'Espresso', 99, { productLeftCount: 0 }),
    cup('paused', 'Espresso', 99, { productStatus: 'PAUSE' }),
    cup('iced', 'Iced Latte', 5), cup('espresso', 'Espresso', 3), cup('latte', 'Latte', 4),
  ] });
  const view = render(<HeroSection />);
  await waitFor(() => expect(get).toHaveBeenCalled());
  expect(view.container.querySelector('.serving-window')).toHaveAttribute('data-open', 'false');
  expect(view.getByText('servingWindow.fullMenu')).toHaveAttribute('href', '/orders?tab=menu');
  fireEvent.click(view.getByText('servingWindow.bold'));
  await waitFor(() => expect(view.getByText('Espresso')).toBeInTheDocument());
  expect(view.getByText('$3.00')).toBeInTheDocument();
  expect(view.getByText('servingWindow.viewDrink')).toHaveAttribute('href', '/products/espresso');
  fireEvent.click(view.getByText('servingWindow.creamy'));
  expect(view.getByText('Latte')).toBeInTheDocument();
  expect(view.container.querySelector('.serving-window')).toHaveAttribute('data-open', 'true');
  fireEvent.click(view.getByText('servingWindow.cold'));
  expect(view.getByText('Iced Latte')).toBeInTheDocument();
  expect(view.getByText('servingWindow.cold').closest('button')).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(view.getByText('servingWindow.cold'));
  expect(view.getByText('Iced Latte')).toBeInTheDocument();
});

it('keeps a usable menu route and labels inspiration honestly when the catalog fails', async () => {
  get.mockRejectedValue(new Error('offline'));
  const view = render(<HeroSection />);
  fireEvent.click(view.getByText('servingWindow.cold'));
  await waitFor(() => expect(view.getByText('servingWindow.catalogFallback')).toBeInTheDocument());
  expect(view.getByText('servingWindow.illustration')).toBeInTheDocument();
  expect(view.getByText('servingWindow.browseDrinks')).toHaveAttribute('href', '/orders?tab=menu');
  expect(view.container.querySelector('.serving-window__price')).toBeNull();
});

it('shows loading feedback then the selected match when data arrives', async () => {
  let resolve = () => {};
  get.mockReturnValue(new Promise(r => { resolve = r; }));
  const view = render(<HeroSection />);
  fireEvent.click(view.getByText('servingWindow.creamy'));
  expect(view.getByText('servingWindow.loading')).toBeInTheDocument();
  resolve({ data: [cup('latte', 'Latte', 4)] });
  await waitFor(() => expect(view.getByText('Latte')).toBeInTheDocument());
  expect(view.container.querySelector('#serving-window-result')).toHaveAttribute('aria-busy', 'false');
});

it('handles failed product photography without mislabeling the replacement', async () => {
  get.mockResolvedValue({ data: [cup('espresso', 'Espresso', 3)] });
  const view = render(<HeroSection />);
  fireEvent.click(view.getByText('servingWindow.bold'));
  await waitFor(() => expect(view.getByAltText('Espresso')).toBeInTheDocument());
  fireEvent.error(view.getByAltText('Espresso'));
  expect(view.getByAltText('servingWindow.atmosphereAlt')).toBeInTheDocument();
  expect(view.getByText('$3.00')).toBeInTheDocument();
});

it('allows visitors to disable motion and aborts the request on unmount', async () => {
  get.mockReturnValue(new Promise(() => {}));
  const view = render(<HeroSection />);
  fireEvent.click(view.getByText('servingWindow.stopMotion'));
  expect(view.container.querySelector('.serving-hero')).toHaveAttribute('data-motion-paused', 'true');
  expect(view.getByText('servingWindow.enableMotion')).toHaveAttribute('aria-pressed', 'true');
  const signal = get.mock.calls[0][1].signal;
  await act(async () => { view.unmount(); });
  expect(signal.aborted).toBe(true);
});
