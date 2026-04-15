import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import type * as ReactRouter from 'react-router';
import { routes } from '@routes/routes';
import * as authService from '@services/authService';
import * as projectService from '@services/projectService';
import * as fileService from '@services/fileService';
import * as jobService from '@services/jobService';

jest.mock('@services/authService');
jest.mock('@services/projectService');
jest.mock('@services/fileService');
jest.mock('@services/jobService');
jest.mock('react-router', () => {
  const actual = jest.requireActual('react-router') as typeof ReactRouter;
  return { ...actual, useNavigate: () => jest.fn() };
});

const mockedIsAuthenticated = jest.mocked(authService.isAuthenticated);
const mockedGetProjects = jest.mocked(projectService.getProjects);
const mockedGetProject = jest.mocked(projectService.getProject);
const mockedGetFiles = jest.mocked(fileService.getFiles);
const mockedGetJobs = jest.mocked(jobService.getJobs);
const mockedCreateJob = jest.mocked(jobService.createJob);

const mockUser = { id: '1', name: 'Admin', email: 'admin@mail.com' };

const mockFile = {
  id: 101,
  name: 'report.pdf',
  size: 2048,
  uploadDate: new Date('2024-03-01'),
};

const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'A test description',
  filesCount: 1,
  jobsCount: 0,
  createDate: new Date('2024-01-01'),
  Files: [mockFile],
  Jobs: [],
};

describe('Project detail page — create job', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockedIsAuthenticated.mockImplementation(async (dispatch) => {
      dispatch({ type: 'LOGIN', payload: { user: mockUser } });
      return true;
    });

    // ProjectLayout calls getProjects; project page calls getProject/getFiles/getJobs
    mockedGetProjects.mockImplementation(async (dispatch) => {
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [mockProject] } });
      return { success: true, projects: [mockProject] };
    });

    mockedGetProject.mockResolvedValue({ success: true, project: mockProject });
    mockedGetFiles.mockResolvedValue({ success: true, files: [mockFile] });
    mockedGetJobs.mockResolvedValue({ success: true, jobs: [] });

    router = createMemoryRouter([routes], {
      initialEntries: ['/projects/1'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    // Wait for the project page to fully load
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  test('"Create new job" button is disabled when no files are selected', () => {
    const createJobButton = screen.getByRole('button', { name: 'Create new job' });
    expect(createJobButton).toBeDisabled();
  });

  test('"Create new job" button becomes enabled after selecting a file', async () => {
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create new job' })).not.toBeDisabled();
    });
  });

  test('calls createJob with the correct project ID and selected file IDs', async () => {
    mockedCreateJob.mockImplementation(async (projectId, _files, dispatch) => {
      const newJob = { id: 999, status: 'PENDING' as const, progress: 0, createdAt: new Date() };
      dispatch({ type: 'ADD_JOB', payload: { projectId, jobs: [newJob] } });
      return { success: true };
    });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create new job' })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create new job' }));

    await waitFor(() => {
      expect(mockedCreateJob).toHaveBeenCalledWith(1, [mockFile.id], expect.any(Function), false);
    });
  });
});
