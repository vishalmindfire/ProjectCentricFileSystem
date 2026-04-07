import logErrorToServer from '@services/errorLogger';
import type { ErrorDetail } from '@entities/Error';
import type { Job } from '@entities/Job';
import type { Project } from '@entities/Project';
import type { FileInfo } from '@entities/File';
import type { ProjectsAction } from '@reducers/projectReducer';

const API_URL = import.meta.env.VITE_API_URL;
const apiEnabled = import.meta.env.VITE_API_ENABLED == true;

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

export const getJobs = async (
  id: Project['id'],
  dispatch: React.Dispatch<ProjectsAction>
): Promise<jobsResponse> => {
  try {
    let jobs: Job[] | [] = [];
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/project/${id}/jobs`, {
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
      jobs = data.jobs;
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
  dispatch: React.Dispatch<ProjectsAction>
): Promise<boolean> => {
  try {
    const bodyContent = {
      files: files,
    };
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/project/${id}/jobs/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
      });
      if (response.status !== 200) {
        throw new Error('Job creation failed');
      }
    }
    const newJob: Job[] = [
      {
        id: Number((Math.random() * 1000000).toFixed(0)),
        status: 'PENDING',
        progress: 0,
        createdAt: new Date(),
      },
    ];
    dispatch({ type: 'ADD_JOB', payload: { projectId: id, jobs: newJob } });
    return true;
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
      const response = await fetch(`${API_URL}/project/${jobId}/jobs/create/${projectId}`, {
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

export const downloadJobData = async (
  jobId: Job['id'],
  projectId: Project['id']
): Promise<jobStatusResponse> => {
  let responseDetail: jobStatusResponse = {
    success: false,
  };
  try {
    if (apiEnabled) {
      const response = await fetch(`${API_URL}/project/${jobId}/jobs/create/${projectId}`, {
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
