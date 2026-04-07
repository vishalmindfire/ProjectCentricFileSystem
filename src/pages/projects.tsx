import { useState, useCallback, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import ProjectTile from '@components/ProjectTile';
import projectModule from '@styles/projects.module.css';
import InputBox from '@components/InputBox';
import Modal from '@components/Modal';
import ProjectForm from '@components/ProjectForm';
import { useProjects } from '@hooks/useProjects';
import { useNavigate } from 'react-router';
import { getProjects } from '@services/projectService';
import { ProjectContext } from '@contexts/ProjectContext';
import Spinner from '@components/Spinner';

function Projects(): React.ReactNode {
  const [isLoading, setIsLoading] = useState(true);
  const { projects } = useProjects();
  const { dispatch } = useContext(ProjectContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      await getProjects(dispatch);
      setIsLoading(false);
    };
    fetchProjects();
  }, [dispatch]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const openProjectHandler = useCallback(
    (id: number) => {
      navigate(`/projects/${id}`);
    },
    [navigate]
  );
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={projectModule.projectsContainer}>
          <div className={projectModule.projectsSpace}>
            {projects.length &&
              projects?.map((project) => {
                return (
                  <ProjectTile
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    filesCounts={project.filesCount}
                    jobCounts={project.jobsCount}
                    createDate={project.createDate}
                    onClick={() => {
                      return openProjectHandler(project.id);
                    }}
                  ></ProjectTile>
                );
              })}
          </div>
          <div className={projectModule.projectSettings}>
            <InputBox
              type="button"
              id="addProject"
              name="addProject"
              value="Add Project"
              onClick={openModal}
            />
          </div>
        </div>
      )}
      {showModal &&
        createPortal(
          <Modal title="Create Project" type="form" open="true" onClose={closeModal}>
            {' '}
            <ProjectForm inModal={true} onClose={closeModal} />
          </Modal>,
          document.body
        )}
    </>
  );
}

export default Projects;
