import { ProjectProvider } from '@contexts/ProjectContext';
import ProjectLayout from '@components/ProjectLayout'
const  Projects = () => {
  return (
    <ProjectProvider>
      <ProjectLayout/>
    </ProjectProvider>
  )
}

export default Projects;