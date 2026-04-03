import { Outlet } from 'react-router';
import { ProjectProvider } from '@contexts/ProjectContext';
const  ProjectsLayout = () => {
  return (
    <ProjectProvider>
      <Outlet/>
    </ProjectProvider>
  )
}

export default ProjectsLayout;

