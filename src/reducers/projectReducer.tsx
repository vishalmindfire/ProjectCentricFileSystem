import { type Project } from '@entities/Project';
import { type FileInfo } from '@entities/File';
import { type Job } from '@entities/Job';
interface ProjectsState {
  projects: Project[] | [];
  isLoading: boolean;
}

type ProjectsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: Project['id'] }
  | { type: 'ADD_FILE'; payload: { projectId: Project['id']; files: FileInfo[] | [] } }
  | { type: 'REMOVE_FILE'; payload: { projectId: Project['id']; fileId: FileInfo['id'] } }
  | { type: 'ADD_JOB'; payload: { projectId: Project['id']; jobs: Job[] | [] } }
  | { type: 'UPDATE_JOB'; payload: { projectId: Project['id']; jobs: Job[] | [] } }
  | { type: 'SET_PROJECTS'; payload: { projects: Project[] | [] } }
  | { type: 'GET_PROJECTS' };

const ProjectsReducer = (state: ProjectsState, action: ProjectsAction): ProjectsState => {
  switch (action.type) {
    case 'SET_LOADING': {
      return { projects: state.projects, isLoading: action.payload };
    }
    case 'ADD_PROJECT': {
      const project: Project = {
        id: action.payload.id,
        name: action.payload.name,
        description: action.payload.description,
        filesCount: 0,
        jobsCount: 0,
        createDate: new Date(),
        Files: [],
        Jobs: [],
      };
      const allProjects: Project[] = [project, ...state.projects];

      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'REMOVE_PROJECT': {
      const allProjects = state?.projects?.filter((project) => project.id !== action.payload) || [];
      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'ADD_FILE': {
      const allProjects = state?.projects?.map((project) => {
        if (project.id === action.payload.projectId) {
          const files = Array.isArray(project.Files) ? project.Files : [];
          const filterNewfiles = action.payload.files.filter((newFile) => {
            const existingFile = files.filter((file) => newFile.id === file.id) || [];
            if (existingFile.length) {
              return false;
            } else {
              return true;
            }
          });
          return {
            ...project,
            Files: [...filterNewfiles, ...files],
            filesCount: filterNewfiles.length + files.length,
          };
        } else {
          return project;
        }
      });
      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'REMOVE_FILE': {
      const allProjects = state?.projects?.map((project) => {
        if (project.id === action.payload.projectId) {
          const filesArray =
            project.Files.filter((file) => file.id !== action.payload.fileId) || [];

          return {
            ...project,
            Files: [...filesArray],
            filesCount: filesArray.length,
          };
        } else {
          return project;
        }
      });
      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'ADD_JOB': {
      const allProjects = state?.projects?.map((project) => {
        if (project.id === action.payload.projectId) {
          const jobs = Array.isArray(project.Jobs) ? project.Jobs : [];
          const filterNewJobs = action.payload.jobs.filter((newJob) => {
            const existingJob = jobs.filter((job) => newJob.id === job.id) || [];
            if (existingJob.length) {
              return false;
            } else {
              return true;
            }
          });
          return {
            ...project,
            Jobs: [...jobs, ...filterNewJobs],
            jobsCount: jobs.length + filterNewJobs.length,
          };
        } else {
          return project;
        }
      });
      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'UPDATE_JOB': {
      const allProjects = state?.projects?.map((project) => {
        if (project.id === action.payload.projectId) {
          const jobs = Array.isArray(project.Jobs) ? project.Jobs : [];
          const updatedJobs = jobs.map((job) => {
            const updatedJob = action.payload.jobs.find((newJob) => newJob.id === job.id);
            return updatedJob ?? job;
          });
          return {
            ...project,
            Jobs: updatedJobs,
          };
        } else {
          return project;
        }
      });
      localStorage.setItem('projects', JSON.stringify(allProjects));
      return { projects: allProjects, isLoading: false };
    }
    case 'SET_PROJECTS': {
      return { projects: action.payload.projects, isLoading: false };
    }
    case 'GET_PROJECTS': {
      const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      return { projects: allProjects, isLoading: false };
    }
    default:
      return state;
  }
};

export { type ProjectsState, type ProjectsAction, ProjectsReducer };
