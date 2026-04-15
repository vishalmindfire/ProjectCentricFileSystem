import logErrorToServer from '@services/errorLogger';
import type { ErrorDetail } from '@entities/Error';
import type { Job } from '@entities/Job';
import type { Project } from '@entities/Project';
import type { FileInfo } from '@entities/File';
import type { ProjectsAction } from '@reducers/projectReducer';
import type { FileResponseType } from '@services/fileService';

const API_URL = import.meta.env.VITE_API_URL;
const apiEnabled = import.meta.env.VITE_API_ENABLED;

interface jobsResponse {
  success: boolean;
  jobs: Job[] | [];
}
type jobStatus = {
  status: string;
  progress: number;
  completedAt?: Date;
};
interface jobStatusResponse {
  success: boolean;
  jobStatus?: jobStatus;
}

interface jobResponseType {
  completed_at: Date | null;
  created_at: Date;
  id: number;
  progress: number;
  project_id: number;
  status: string;
  zip_path: null | string;
}

interface missingFilesResponse {
  success: boolean;
  missingFiles?: FileInfo[];
}

export const getJobs = async (
  id: Project['id'],
  dispatch: React.Dispatch<ProjectsAction>
): Promise<jobsResponse> => {
  try {
    let jobs: Job[] | [] = [];
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/projects/${id}/jobs/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error('Job fetching Failed');
      }
      jobs = data.jobs.map((job: jobResponseType) => {
        return {
          id: job.id,
          status: job.status,
          progress: job.progress,
          createdAt: job.completed_at,
          completedAt: job.completed_at,
        };
      });
    }
    const payload = {
      projectId: id,
      jobs: jobs,
    };
    dispatch({ type: 'ADD_JOB', payload: payload });
    return { success: true, jobs: jobs };
  } catch (error) {
    logError(error, 'Get Jobs Call');
    throw error;
  }
};

export const createJob = async (
  id: Project['id'],
  files: FileInfo['id'][],
  dispatch: React.Dispatch<ProjectsAction>,
  skipMissing: boolean | undefined
): Promise<missingFilesResponse> => {
  try {
    const bodyContent = {
      fileIds: files,
      ignoreMissing: skipMissing,
    };
    let newJob: Job[];
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/projects/${id}/jobs/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
      });
      const data = await response.json();
      if (response.status === 200 && !data.success) {
        const missingFiles: FileInfo[] = data.missing_files.map((file: FileResponseType) => {
          return {
            id: file.id,
            name: file.name,
            size: file.size,
            uploadDate: file.created_at,
          };
        });
        return { missingFiles: missingFiles, success: false };
      }
      if (response.status !== 202) {
        throw new Error('Job creation failed');
      }
      newJob = [
        {
          id: data.job.id,
          status: data.job.status,
          progress: data.job.progress,
          createdAt: data.job.completed_at,
          completedAt: data.job.completed_at,
        },
      ];
    } else {
      newJob = [
        {
          id: Number((Math.random() * 1000000).toFixed(0)),
          status: 'PENDING',
          progress: 0,
          createdAt: new Date(),
        },
      ];
    }
    dispatch({ type: 'ADD_JOB', payload: { projectId: id, jobs: newJob } });
    return { success: true };
  } catch (error) {
    logError(error, 'Create Job Call');
    throw error;
  }
};

export const getJobStatus = async (
  jobId: Job['id'],
  projectId: Project['id']
): Promise<jobStatusResponse> => {
  let responseDetail: jobStatusResponse = {
    success: false,
  };
  try {
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/projects/${projectId}/jobs/${jobId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        throw new Error('Job status fetch failed');
      }
      const data = await response.json();
      responseDetail = {
        success: true,
        jobStatus: data.job,
      };
    }
    return responseDetail;
  } catch (error) {
    logError(error, 'Get Job Status Call');
    throw error;
  }
};

export const downloadJobData = async (
  jobId: Job['id'],
  projectId: Project['id']
): Promise<jobStatusResponse> => {
  let responseDetail: jobStatusResponse = {
    success: false,
  };
  try {
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/projects/${projectId}/jobs/${jobId}/download`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        throw new Error('Job status fetch failed');
      }
      const data = await response.json();
      responseDetail = {
        success: true,
        jobStatus: data,
      };
    }
    return responseDetail;
  } catch (error) {
    logError(error, 'Get Job Status Call');
    throw error;
  }
};

function logError(error: unknown, stack: string): void {
  const errorDetail: ErrorDetail = {
    error: error instanceof Error ? error : new Error(String(error)),
    errorInfo: {
      componentStack: stack,
    },
    context: {
      component: 'projectService',
    },
  };
  logErrorToServer(errorDetail, null);
}
