import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@routes/routes';
import * as authService from '@services/authService';
import * as projectService from '@services/projectService';
import * as fileService from '@services/fileService';

jest.mock('@services/authService');
jest.mock('@services/projectService');
jest.mock('@services/fileService');

const mockedIsAuthenticated = jest.mocked(authService.isAuthenticated);
const mockedGetProjects = jest.mocked(projectService.getProjects);
const mockedUploadFile = jest.mocked(fileService.uploadFile);
const mockedGetFiles = jest.mocked(fileService.getFiles);
const mockedDeleteFile = jest.mocked(fileService.deleteFile);

const mockUser = { id: '1', name: 'Admin', email: 'admin@mail.com' };

const mockSavedFile = {
  id: 101,
  name: 'document.pdf',
  size: 1024,
  uploadDate: new Date('2024-01-15'),
};

const mockProject = {
  id: 1,
  name: 'Test Project',
  description: 'A test description',
  filesCount: 1,
  jobsCount: 0,
  createDate: new Date('2024-01-01'),
  Files: [mockSavedFile],
  Jobs: [],
};

// Simulates selecting files via the hidden DragAndDrop file input.
// Object.defineProperty is needed because HTMLInputElement.files is read-only.
const selectFiles = (files: File[]) => {
  const fileInput = document.getElementById('browse') as HTMLInputElement;
  Object.defineProperty(fileInput, 'files', { value: files, configurable: true });
  fireEvent.change(fileInput);
};

describe('Files page', () => {
  let router: ReturnType<typeof createMemoryRouter>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockedIsAuthenticated.mockImplementation(async (dispatch) => {
      dispatch({ type: 'LOGIN', payload: { user: mockUser } });
      return true;
    });

    mockedGetProjects.mockImplementation(async (dispatch) => {
      dispatch({ type: 'SET_PROJECTS', payload: { projects: [mockProject] } });
      return { success: true, projects: [mockProject] };
    });

    router = createMemoryRouter([routes], {
      initialEntries: ['/projects/1/files'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    // Wait for auth + project context to settle before each test
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
  });

  test('shows saved files list before upload', () => {
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1024B')).toBeInTheDocument();
    expect(screen.queryByText('No files found')).not.toBeInTheDocument();
  });

  test('removes a pending file from the drag-and-drop list before upload', async () => {
    const pendingFile = new File(['hello'], 'pending.txt', { type: 'text/plain' });

    selectFiles([pendingFile]);

    await waitFor(() => {
      expect(screen.getByText('pending.txt')).toBeInTheDocument();
    });

    // MdClear from react-icons renders as an SVG — click it to remove the file
    const clearIcon = document.querySelector('[class*="fileActions"] svg') as SVGElement;
    fireEvent.click(clearIcon);

    await waitFor(() => {
      expect(screen.queryByText('pending.txt')).not.toBeInTheDocument();
    });
  });

  test('uploads selected files and refreshes the saved file list', async () => {
    mockedUploadFile.mockResolvedValue({ success: true });
    mockedGetFiles.mockResolvedValue({ success: true, files: [mockSavedFile] });

    const pendingFile = new File(['content'], 'upload.txt', { type: 'text/plain' });

    selectFiles([pendingFile]);

    // Wait for DragAndDrop's useEffect to propagate the file to Files page state
    await waitFor(() => {
      expect(screen.getByText('upload.txt')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() => {
      expect(mockedUploadFile).toHaveBeenCalledWith(
        [pendingFile],
        expect.any(Function),
        1,
        expect.any(Function)
      );
      expect(mockedGetFiles).toHaveBeenCalledWith(1, expect.any(Function));
    });
  });

  test('deletes a saved file from the file list', async () => {
    mockedDeleteFile.mockImplementation(async (projectId, fileId, dispatch) => {
      dispatch({ type: 'REMOVE_FILE', payload: { projectId, fileId } });
      return true;
    });

    expect(screen.getByText('document.pdf')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Delete File')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockedDeleteFile).toHaveBeenCalledWith(1, 101, expect.any(Function));
      expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
    });
  });
});
