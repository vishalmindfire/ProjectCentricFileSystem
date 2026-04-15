import projectTileModule from '@styles/projectTile.module.css';
import { createPortal } from 'react-dom';
import { deleteProject } from '@services/projectService';
import { useState, useContext, type MouseEvent } from 'react';
import { ProjectContext } from '@contexts/ProjectContext';
import Modal from '@components/Modal';
interface ProjectTileProps {
  id: number;
  name: string;
  description: string;
  filesCounts: number;
  jobCounts: number;
  createDate: Date;
  onClick?: (e: MouseEvent<Element>) => void;
}

const ProjectTile = (props: ProjectTileProps) => {
  const { dispatch } = useContext(ProjectContext);
  const [showModal, setShowModal] = useState(false);
  const deleteProjectHandler = async (id: number) => {
    await deleteProject(id, dispatch);
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className={projectTileModule.projectTile}
        id={props.id.toString()}
        onClick={props.onClick}
      >
        <div className={projectTileModule.projectTileHeader}>
          <h3 className={projectTileModule.projectTileName}>{props.name}</h3>
          <span id="delete-project" className={projectTileModule.projectDelete} onClick={openModal}>
            Delete
          </span>
        </div>
        <div className={projectTileModule.projectdetails}>
          <p className={projectTileModule.projectDescription}>{props.description}</p>
          <div className={projectTileModule.projectMoreInfo}>
            <div className={projectTileModule.projectMoreInfoRow}>
              <span className={projectTileModule.projectMoreInfoTitle}>Files Count:</span>
              <span className={projectTileModule.projectMoreInfoValue}>{props.filesCounts}</span>
            </div>
            <div className={projectTileModule.projectMoreInfoRow}>
              <div className={projectTileModule.projectMoreInfoTitle}>Jobs Count:</div>
              <div className={projectTileModule.projectMoreInfoValue}>{props.jobCounts}</div>
            </div>
          </div>
        </div>
        <div className={projectTileModule.projectTileFooter}>
          <div className={projectTileModule.projectMoreInfoRow}>
            <div className={projectTileModule.projectMoreInfoTitle}>Create Date:</div>
            <div className={projectTileModule.projectMoreInfoValue}>
              {new Date(props.createDate).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal
            title="Delete Project"
            type="confirm"
            open="true"
            onClose={closeModal}
            onSubmit={() => {
              deleteProjectHandler(props.id);
            }}
          >
            <div className={projectTileModule.confirmBox}>
              This will permanently delete the project and its related assets. Are you sure?
            </div>
          </Modal>,
          document.body
        )}
    </>
  );
};

export default ProjectTile;
