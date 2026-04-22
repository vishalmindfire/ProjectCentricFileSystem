import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@routes/routes';
import * as authService from '@services/authService';
import * as ReactRouterDOM from 'react-router-dom';

const mockedUseNavigate = jest.fn();

jest.mock('@services/authService');
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom') as typeof ReactRouterDOM;
  return {
    ...originalModule,
    useNavigate: () => mockedUseNavigate,
  };
});

const mockedLogin = jest.mocked(authService.login);
const mockedIsAuthenticated = jest.mocked(authService.isAuthenticated);

describe('Login form', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockedIsAuthenticated.mockImplementation(async (dispatch) => {
      dispatch({ type: 'LOGOUT' });
      return false;
    });

    router = createMemoryRouter([routes], {
      initialEntries: ['/login'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
  });

  const getElements = () => ({
    logInButton: screen.getByTestId('login-button'),
    emailInput: screen.getByTestId('email-input'),
    passwordInput: screen.getByTestId('password-input'),
  });

  test('shows error when email is empty', async () => {
    const { logInButton } = getElements();

    fireEvent.click(logInButton);

    expect(await screen.findByText('Email address is required')).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const { logInButton, emailInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'john@mail.com' } });
    fireEvent.click(logInButton);

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  test('navigates to projects page on successful login', async () => {
    mockedLogin.mockResolvedValue({
      success: true,
      user: { id: '1', name: 'Admin', email: 'admin@mail.com' },
    });

    const { logInButton, emailInput, passwordInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'admin@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(logInButton);

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith('/projects', { replace: true });
    });
  });
});
