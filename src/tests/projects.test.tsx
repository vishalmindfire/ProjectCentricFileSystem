import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type * as ReactRouter from 'react-router';
import { routes } from '@routes/routes';
import * as authService from '@services/authService';
import * as projectService from '@services/projectService';

const mockNavigate = jest.fn();

jest.mock('@services/authService');
jest.mock('@services/projectService');
jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router') as typeof ReactRouter;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedIsAuthenticated = jest.mocked(authService.isAuthenticated);
const mockedGetProjects = jest.mocked(projectService.getProjects);
const mockedCreateProject = jest.mocked(projectService.createProject);
const mockedDeleteProject = jest.mocked(projectService.deleteProject);

const mockUser = { id: '1', name: 'Admin', email: 'admin@mail.com' };

const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'A test description',
  filesCount: 0,
  jobsCount: 0,
  createDate: new Date('2024-01-01'),
  Files: [],
  Jobs: [],
};

describe('Projects page', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Establish auth by dispatching LOGIN through the mock
    mockedIsAuthenticated.mockImplementation(async (dispatch) => {
      dispatch({ type: 'LOGIN', payload: { user: mockUser } });
      return true;
    });

    // Seed one project via dispatch so the project list renders
    mockedGetProjects.mockImplementation(async (dispatch) => {
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [mockProject] } });
      return { success: true, projects: [mockProject] };
    });

    router = createMemoryRouter([routes], {
      initialEntries: ['/projects'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    // Wait for auth + project load to settle
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add Project' })).toBeInTheDocument();
    });
  });

  describe('project form validation', () => {
    beforeEach(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Add Project' }));
      await waitFor(() => {
        expect(screen.getByText('Create Project')).toBeInTheDocument();
      });
    });

    test('shows error when project name is empty', async () => {
      // ProjectForm renders with defaultValue="test" — clear it before submitting
      fireEvent.change(screen.getByTestId('project-name-input'), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      expect(await screen.findByText('Project name is required')).toBeInTheDocument();
    });

    test('shows error when project description is empty', async () => {
      // Name keeps its default "test" value; clear only the description
      fireEvent.change(screen.getByTestId('project-desc-input'), { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      expect(await screen.findByText('Description is required')).toBeInTheDocument();
    });
  });

  describe('create project', () => {
    test('calls createProject with form values and closes the modal on success', async () => {
      mockedCreateProject.mockImplementation(async (name, description, dispatch) => {
        const newProject = { ...mockProject, id: 2, name, description };
        dispatch({ type: 'ADD_PROJECT', payload: newProject });
        return { success: true, project: newProject };
      });

      fireEvent.click(screen.getByRole('button', { name: 'Add Project' }));
      await waitFor(() => {
        expect(screen.getByText('Create Project')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('project-name-input'), {
        target: { value: 'My New Project' },
      });
      fireEvent.change(screen.getByTestId('project-desc-input'), {
        target: { value: 'My New Description' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() => {
        expect(mockedCreateProject).toHaveBeenCalledWith(
          'My New Project',
          'My New Description',
          expect.any(Function)
        );
        expect(screen.queryByText('Create Project')).not.toBeInTheDocument();
      });
    });
  });

  describe('delete project', () => {
    test('calls deleteProject and removes the project from the list', async () => {
      mockedDeleteProject.mockImplementation(async (id, dispatch) => {
        dispatch({ type: 'REMOVE_PROJECT', payload: id });
        return true;
      });

      expect(screen.getByText('Test Project')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(mockedDeleteProject).toHaveBeenCalledWith(mockProject.id, expect.any(Function));
        expect(screen.queryByText('Test Project')).not.toBeInTheDocument();
      });
    });
  });
});
