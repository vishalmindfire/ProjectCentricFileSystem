import { type ProjectsAction } from '@contexts/ProjectContext';
import { type Project } from '@entities/Project';
import logErrorToServer from '@services/errorLogger';
import { type ErrorDetail } from '@entities/Error';

const API_URL = import.meta.env.VITE_API_URL;
const apiEnabled = import.meta.env.VITE_API_ENABLED === true;
console.log(apiEnabled === false);
interface createdResponse {
  success: boolean;
  project: { id: number; name: string; description: string };
}

interface projectResponse {
    success: boolean,
    project: Project[]
}
interface projectsResponse {
    success: boolean,
    projects: Project[] | []
}

export const createProject = async (
  name: string,
  description: string,
  dispatch: React.Dispatch<ProjectsAction>
): Promise<createdResponse> => {
  
    let project : Project = {
        id: Number((Math.random() * 1000000).toFixed(0)),
        name: name,
        description: description,
        filesCount: 0,
        jobsCount: 0,
        createDate: new Date(),
        Files: [],
        Jobs: [],
    } 
  try {
    if(apiEnabled){
        const bodyContent = {
            name: name,
            description: description,
        };

        const response = await fetch(`${API_URL}/project`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyContent),
            credentials: 'include',
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error('Project creation Failed');
        }
        project = data.project;
    }
    
    const data = {
        project: project
    }
    dispatch({ type: 'ADD_PROJECT', payload: data.project });
    return { success: true, project: data.project };
  } catch (error) {
    logError(error, "Create Project Call");
    throw error;
  }
};


export const deleteProject = async (id: Project["id"],dispatch: React.Dispatch<ProjectsAction>): Promise<boolean> => {
    
    try {
        if(apiEnabled){
            const response = await fetch(`${API_URL}/project/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401 || response.status === 403) {
             throw new Error("Project deletion failed");
            }
        }
    dispatch({ type: 'REMOVE_PROJECT', payload: id });
    return true;
  } catch (error) {
    logError(error, "Remove Project Call");
    throw error;
  }
};

export const getProjects = async (dispatch: React.Dispatch<ProjectsAction>) : Promise<projectsResponse> => {
    let projects: Project[] = [];
    try {
        if(apiEnabled){
            const response = await fetch(`${API_URL}/project/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error('Project creation Failed');
            }
            projects = data.projects;
        }else{
            projects = JSON.parse(localStorage.getItem("projects") || '[]');
            dispatch({ type : 'SET_PROJECTS' , payload: { projects : projects}})
        }
        const projectResponseData:projectsResponse = {
            success: true, projects: projects
        } 
        return projectResponseData;
    } catch(error){
        logError(error, "Get Project Call");
        throw error;
    }
}

export const getProject = async (id: number,dispatch: React.Dispatch<ProjectsAction>) : Promise<projectResponse> => {
    let project: Project[];
    try {
        if(apiEnabled){
            const response = await fetch(`${API_URL}/project/${id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error('Project creation Failed');
            }
            project = data.project;
        }else{
            const projects = JSON.parse(localStorage.getItem("projects") || '[]');
            dispatch({ type : 'SET_PROJECTS' , payload: { projects : projects}})
            project = projects.filter((project: Project) => project.id === id);
        }
        const projectResponseData:projectResponse = {
                success: true, project: project
            } 
        return projectResponseData;
    } catch(error){
        logError(error, "Get Project Call");
        throw error;
    }
}

function logError(error: unknown, stack: string): void{
    const errorDetail: ErrorDetail = {
        error: error instanceof Error ? error : new Error(String(error)),
        errorInfo: {
            componentStack: stack
        },
        context : {
            component: "projectService"
        }
    }
    logErrorToServer(errorDetail,null);
}
