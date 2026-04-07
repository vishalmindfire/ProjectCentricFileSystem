import projectTileModule from '@styles/projectTile.module.css';
import { deleteProject } from '@services/projectService';
import { useContext, type MouseEvent } from 'react';
import { ProjectContext } from '@contexts/ProjectContext';
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
  const deleteProjectHandler = async (id: number) => {
    await deleteProject(id, dispatch);
  };

  return (
    <div className={projectTileModule.projectTile} id={props.id.toString()} onClick={props.onClick}>
      <div className={projectTileModule.projectTileHeader}>
        <h3 className={projectTileModule.projectTileName}>{props.name}</h3>
        <span
          id="delete-project"
          className={projectTileModule.projectDelete}
          onClick={() => {
            deleteProjectHandler(props.id);
          }}
        >
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
            {props.createDate.toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTile;
