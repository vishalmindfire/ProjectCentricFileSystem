import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@routes/routes';
import * as authService from '@services/authService';
import * as ReactRouterDOM from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('@services/authService');
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as typeof ReactRouterDOM;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedLogin = jest.mocked(authService.login);
const mockedIsAuthenticated = jest.mocked(authService.isAuthenticated);

describe('Login form', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsAuthenticated.mockResolvedValue(false);

    router = createMemoryRouter([routes], {
      initialEntries: ['/login'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);
  });

  const getElements = () => ({
    loginButton: screen.getByTestId('login-button'),
    emailInput: screen.getByTestId('email-input'),
    passwordInput: screen.getByTestId('password-input'),
  });

  test('shows error when email is empty', async () => {
    const { loginButton } = getElements();

    fireEvent.click(loginButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const { loginButton, emailInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'admin@mail.com' } });
    fireEvent.click(loginButton);

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  test('navigates to projects page on successful login', async () => {
    mockedLogin.mockResolvedValue({
      success: true,
      user: { id: '1', name: 'Admin', email: 'admin@mail.com' },
    });

    const { loginButton, emailInput, passwordInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'admin@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/projects', { replace: true });
    });
  });
});
