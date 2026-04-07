import { useContext, useState } from 'react';
import { ProjectContext } from '@contexts/ProjectContext';
import InputBox from '@components/InputBox';
import projectFormModule from '@styles/projectForm.module.css';
import { createProject } from '@services/projectService';

interface Props {
  inModal?: boolean;
  onClose?: () => void;
}

function ProjectForm(props: Props) {
  const { dispatch } = useContext(ProjectContext);
  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);
  const createProjectHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectName = document.getElementById('projectName') as HTMLInputElement;
    const projectDesc = document.getElementById('projectDesc') as HTMLInputElement;
    if (!projectName.value) {
      setNameError('Project name is required');
      return;
    } else {
      setNameError(null);
    }
    if (!projectDesc.value) {
      setDescError('Description is required');
      return;
    } else {
      setDescError(null);
    }
    //console.log(dispatch);
    const response = await createProject(projectName.value, projectDesc.value, dispatch).catch(
      (err) => {
        console.error('Login failed:', err);
        return { success: false, user: null };
      }
    );

    if (response.success) {
      if (props.inModal && props.onClose) {
        props.onClose();
      }
    }
  };
  return (
    <form onSubmit={createProjectHandler} className={projectFormModule.projectForm}>
      <div className={projectFormModule.projectFormHeader}>
        {!props.inModal && <h1>Create Project</h1>}
      </div>

      <div className={projectFormModule.projectFormBody}>
        <InputBox
          label="Name"
          name="projectName"
          id="projectName"
          type="text"
          defaultValue="test"
          error={nameError}
          data-testid="project-name-input"
          modal={true}
        />
        <InputBox
          label="Description"
          name="projectDesc"
          id="projectDesc"
          type="text"
          defaultValue="test"
          error={descError}
          data-testid="project-desc-input"
          modal={true}
        />
      </div>
      <InputBox name="projectAdd" id="projectAdd" value="Create" type="submit" />
    </form>
  );
}

export default ProjectForm;
