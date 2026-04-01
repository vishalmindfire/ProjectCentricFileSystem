import { type ProjectsAction } from '@contexts/ProjectContext';
import { type Project } from '@entities/Project';

const API_URL = import.meta.env.VITE_API_URL;
interface createdResponse {
  success: boolean;
  project: { id: string; name: string; description: string };
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
  /*const bodyContent = {
    name: name,
    description: description,
  };*/
  
  try {
    console.log(API_URL);
    /*
    const response = await fetch(`${API_URL}/project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyContent),
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok || !data.success) {
      throw new Error('Project creation Failed');
    }
      */
    const project : Project = {
        id: (Math.random() * 1000000).toFixed(0).toString(),
        name: name,
        description: description,
        filesCount: 0,
        jobsCount: 0,
        createDate: new Date()
    } 
    const data = {
        project: project
    }
    dispatch({ type: 'ADD_PROJECT', payload: data.project });
    return { success: true, project: data.project };
  } catch (error) {
    console.error('Project creation error' + error);
    throw error;
  }
};


export const deleteProject = async (id: Project["id"],dispatch: React.Dispatch<ProjectsAction>): Promise<boolean> => {
    try {
    const response = await fetch(`${API_URL}/project/`+id, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 401 || response.status === 403) {
      console.log(response);
    }
    dispatch({ type: 'REMOVE_PROJECT', payload: id });
    return true;
  } catch (error) {
     dispatch({ type: 'REMOVE_PROJECT', payload: id });
    console.log(error);
    return false;
  }
};

export const getProjects = async (dispatch: React.Dispatch<ProjectsAction>) : Promise<projectsResponse> => {
    dispatch({ type: "GET_PROJECTS" });
    const projects: projectsResponse = { success: true, projects: []}
    return projects;
}
