import { type Project } from '@entities/Project';

interface ProjectsState {
  projects: Project[] | [];
  isLoading: boolean;
}

type ProjectsAction =
    {type: 'GET_PROJECTS'}
  | { type: 'GET_PROJECT'; payload: Project['id'] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: Project['id'] };

const ProjectsReducer = (state: ProjectsState, action: ProjectsAction): ProjectsState => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        projects: [
          ...state.projects,
          {
            id: action.payload.id,
            name: action.payload.name,
            description: action.payload.description,
            filesCount: 0,
            jobsCount: 0,
            createDate: new Date(),
          },
        ],
        isLoading: false,
      };
    case 'REMOVE_PROJECT':
      return {
        projects: state?.projects?.filter((project) => project.id !== action.payload) || [],
        isLoading: false,
      };
    case 'GET_PROJECTS':
        return {
            projects: state?.projects,
            isLoading: false
        }
    case 'GET_PROJECT':
        return {
            projects: state?.projects?.filter((project) => project.id === action.payload) || [],
            isLoading: false
        }
    default:
      return state;
  }
};

export { type ProjectsState, type ProjectsAction, ProjectsReducer };
