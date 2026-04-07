import { useContext, useState } from 'react';
import DragAndDropBox from '@components/DragAndDrop';
import ProgressBar from '@components/ProgressBar';
import InputBox from '@components/InputBox';
import FileList from '@components/FileList';
import { getFiles, uploadFile } from '@services/fileService';
import filesModule from '@styles/files.module.css';
import { useFiles } from '@hooks/useFiles';
import { useProject } from '@hooks/useProject';
import { useParams } from 'react-router-dom';
import { ProjectContext } from '@contexts/ProjectContext';

const Files = () => {
  const [files, setFiles] = useState<File[] | []>([]);
  const [progress, setProgress] = useState<number>(0);
  const { id } = useParams();
  const projectId = Number(id);
  const savedfiles = useFiles(projectId);
  const { isLoading } = useProject(projectId);
  const { dispatch } = useContext(ProjectContext);

  const fileUploadHandler = async () => {
    setProgress(0);
    const response = await uploadFile(files, setProgress, projectId, dispatch);
    if (response.success) {
      await getFiles(projectId, dispatch);
    }
  };
  return (
    <div className={filesModule.filesContainer}>
      <div className={filesModule.filesSettings}>
        <DragAndDropBox dropBoxType="DEFAULT" onSelectedFiles={setFiles} />
        <ProgressBar value={progress} max={100} label="File Uploading" />
        <InputBox type="button" onClick={fileUploadHandler} value="Upload" />
      </div>
      <div className={filesModule.filesSection}>
        <FileList files={savedfiles} projectId={projectId} isLoading={isLoading}></FileList>
      </div>
    </div>
  );
};

export default Files;
