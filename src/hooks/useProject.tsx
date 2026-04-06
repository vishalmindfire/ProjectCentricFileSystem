import { ProjectContext } from '@contexts/ProjectContext';
import { useContext } from 'react';
import { type Project } from '@entities/Project';

interface ProjectResponse {
  project: Project[] | [];
  isLoading: boolean;
}
export const useProject = (projectId: Project['id'] | []): ProjectResponse => {
  const { projectsState } = useContext(ProjectContext);
  const currentProject = projectsState.projects.filter(
    (projectFiler: Project) => projectFiler.id === projectId
  );
  return { project: currentProject, isLoading: projectsState.isLoading };
};
