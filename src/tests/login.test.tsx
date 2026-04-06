import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@routes/routes';
import * as ReactRouterDOM from 'react-router-dom';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom') as typeof ReactRouterDOM;
  return {
    ...originalModule,
    useNavigate: () => mockedUseNavigate,
  };
});

test('Login form', () => {
  const navigateMock = jest.fn();
  mockedUseNavigate.mockReturnValue(navigateMock);
  const router = createMemoryRouter([routes], {
    initialEntries: ['/login'],
    initialIndex: 0,
  });

  render(<RouterProvider router={router} />);

  const logInButton = screen.getByTestId('login-button') as HTMLButtonElement;
  const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
  const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

  const logInClickEvent = () => {
    fireEvent.click(
      logInButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
  };
  const inputChangeEvent = (inputElement: HTMLInputElement, value: string) => {
    fireEvent.change(inputElement, { target: { value } });
  };

  logInClickEvent();
  waitFor(() => screen.findByText('Email is required'));
  inputChangeEvent(emailInput, 'admin@mail.com');
  logInClickEvent();
  waitFor(() => screen.findByText('Password is required'));
  inputChangeEvent(emailInput, 'admin@mail.com');
  inputChangeEvent(passwordInput, 'admin123');
  logInClickEvent();
  waitFor(async () => {
    await expect(screen.getByText('Projects Page')).toBeInTheDocument();
    //expect(mockedUseNavigate).toHaveBeenCalledWith('/projects', { replace: true });
    await expect(router.state.location.pathname).toBe('/projects');
  });
});
