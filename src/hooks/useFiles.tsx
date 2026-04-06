import { ProjectContext } from '@contexts/ProjectContext';
import { useContext } from 'react';
import { type Project } from '@entities/Project';
import { type FileInfo } from '@entities/File';

export const useFiles = (projectId: number): FileInfo[] | [] => {
  const { projectsState } = useContext(ProjectContext);
  const filteredProjects: Project[] =
    projectsState.projects.filter((project) => project.id === projectId) || [];
  const files = filteredProjects.length > 0 ? filteredProjects[0].Files : [];
  return files;
};
