import { ProjectContext } from '@contexts/ProjectContext';
import { useContext } from 'react';
import { type Project } from '@entities/Project';
import { type Job } from '@entities/Job';

export const useJobs = (projectId: number): Job[] | [] => {
  const { projectsState } = useContext(ProjectContext);
  const filteredProjects: Project[] =
    projectsState.projects.filter((project) => project.id === projectId) || [];
  const jobs = filteredProjects.length > 0 ? filteredProjects[0].Jobs : [];
  return jobs;
};
