import fileListModule from '@styles/fileList.module.css';
import { type FileInfo } from '@entities/File';
import { deleteFile } from '@services/fileService';
import { ProjectContext } from '@contexts/ProjectContext';
import { useContext, useEffect } from 'react';

type FileListProps = {
  files: FileInfo[];
  projectId: number;
  isLoading: boolean;
};

const FileList = (props: FileListProps) => {
  const { dispatch } = useContext(ProjectContext);
  const removeFileHandler = (id: number, fileId: number) => {
    deleteFile(id, fileId, dispatch);
  };

  useEffect(() => {}, [props.files]);

  if (!props.files || props.files.length === 0) {
    return <div className={fileListModule.empty}>No files found</div>;
  }

  return (
    <ul className={fileListModule.fileList}>
      <li key="header" className={fileListModule.fileListHeader}>
        <div className={fileListModule.fileName}>Name</div>
        <div className={fileListModule.fileSize}>Size</div>
        <div className={fileListModule.fileModified}>Upload Date</div>
        <div className={fileListModule.fileDeleteHeader}>&nbsp;</div>
      </li>
      {props.files.map((file) => (
        <li key={file.id} className={fileListModule.fileListItem}>
          <div className={fileListModule.fileName}>{file.name}</div>
          {file.size && <div className={fileListModule.fileSize}>{file.size}B</div>}
          {file.uploadDate && (
            <div className={fileListModule.fileModified}>
              {new Date(file.uploadDate).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          )}
          <button
            className={fileListModule.deleteFile}
            onClick={() => removeFileHandler(props.projectId, file.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FileList;
