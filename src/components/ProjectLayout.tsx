import { useState, useCallback } from 'react'; 
import {createPortal} from 'react-dom';
import ProjectTile from '@components/ProjectTile';
import projectModule from '@styles/projects.module.css';
import InputBox from '@components/InputBox';
import Modal from '@components/Modal';
import ProjectForm from '@components/ProjectForm';
import { useProjects } from '@hooks/useProjects';
import { useNavigate } from 'react-router';

function Projects(): React.ReactNode {
  const { projects } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }
  const openProjectHandler = useCallback((event: React.MouseEvent<Element>,id:string) => {
    console.log(event);
    if((event.target as HTMLElement).id === "delete-project"){
        return;
    }
     navigate("/projects/"+id, { replace : true});
  },[navigate])
  console.log(projects);
  return (
    <>
    <div className={projectModule.projectsContainer}>
      <div className={projectModule.projectsSpace}>
        {<ProjectTile
          id="1"
          name="Test"
          description="Testing"
          filesCounts={0}
          jobCounts={0}
          createDate={new Date()}
        ></ProjectTile>}
        {
          projects?.map( (project) => {
             return <ProjectTile
                id={project.id}
                name={project.name}
                description={project.description}
                filesCounts={project.filesCount}
                jobCounts={project.jobsCount}
                createDate={project.createDate}
                onClick = { (e : React.MouseEvent<Element>) => { return openProjectHandler(e,project.id) } }
              ></ProjectTile>
          })
        }
        
      </div>
      <div className={projectModule.projectSettings}>
        <InputBox type="button" id="addProject" name="addProject" value="Add Project" onClick={openModal}/>
      </div>
    </div>
    { showModal && createPortal(
      <Modal title="Create Project" type="form" open="true" onClose={closeModal}> <ProjectForm inModal={true} onClose={closeModal}/></Modal>,
      document.body
    )}
    </>
  );
}

export default Projects;
