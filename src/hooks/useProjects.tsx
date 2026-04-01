import { ProjectContext, type ProjectsState } from '@contexts/ProjectContext';
import { useContext } from 'react';

export const useProjects = (): ProjectsState => {
  const { projectsState } = useContext(ProjectContext);
  return projectsState;
};
