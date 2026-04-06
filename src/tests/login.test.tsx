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

describe('Login form', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(() => {
    jest.clearAllMocks();

    router = createMemoryRouter([routes], {
      initialEntries: ['/login'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);
  });

  const getElements = () => ({
    logInButton: screen.getByTestId('login-button'),
    emailInput: screen.getByTestId('email-input'),
    passwordInput: screen.getByTestId('password-input'),
  });

  test('shows error when email is empty', async () => {
    const { logInButton } = getElements();

    fireEvent.click(logInButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const { logInButton, emailInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'admin@mail.com' } });
    fireEvent.click(logInButton);

    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  test('navigates to projects page on successful login', async () => {
    const navigateMock = jest.fn();
    mockedUseNavigate.mockReturnValue(navigateMock);

    const { logInButton, emailInput, passwordInput } = getElements();

    fireEvent.change(emailInput, { target: { value: 'admin@mail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(logInButton);

    await waitFor(async () => {
      //await expect(screen.getByText('Add Project')).toBeInTheDocument();
      //expect(mockedUseNavigate).toHaveBeenCalledWith('/projects', { replace: true });
      await expect(router.state.location.pathname).toBe('/projects');
    });
    // expect(navigateMock).toHaveBeenCalledWith('/projects', { replace: true });
  });
});
