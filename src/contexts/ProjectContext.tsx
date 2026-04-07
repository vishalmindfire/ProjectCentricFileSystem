import React, { createContext, useReducer } from 'react';
import { type ProjectsState, type ProjectsAction, ProjectsReducer } from '@reducers/projectReducer';
import { getProjects } from '@services/projectService';
//import { getProjects } from "@services/projectService";

type ProviderProps = {
  children: React.ReactNode;
};

const initialState: ProjectsState = {
  projects: [],
  isLoading: true,
};

const ProjectContext = createContext<{
  projectsState: ProjectsState;
  dispatch: React.Dispatch<ProjectsAction>;
}>({
  projectsState: initialState,
  dispatch: () => null,
});

const ProjectProvider = (props: ProviderProps): React.ReactNode => {
  const [state, dispatch] = useReducer(ProjectsReducer, initialState);
  React.useEffect(() => {
    const getAllProjects = async () => {
      await getProjects(dispatch);
    };
    getAllProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projectsState: state, dispatch }}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export {
  type ProjectsState,
  type ProjectsAction,
  ProjectContext,
  ProjectsReducer,
  ProjectProvider,
};
