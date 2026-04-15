import fileListModule from '@styles/fileList.module.css';
import { type FileInfo } from '@entities/File';
import { deleteFile } from '@services/fileService';
import { ProjectContext } from '@contexts/ProjectContext';
import { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '@components/Modal';

type FileListProps = {
  files: FileInfo[];
  projectId: number;
  isLoading: boolean;
  showSelection?: boolean;
  checkboxChangeEvent?: () => void;
};

const FileList = (props: FileListProps) => {
  const [showModal, setShowModal] = useState(false);
  const [fileId, setFileId] = useState(0);
  const { dispatch } = useContext(ProjectContext);
  const removeFileHandler = (id: number, fileId: number) => {
    deleteFile(id, fileId, dispatch);
    setShowModal(false);
  };

  const openModal = (id: FileInfo['id']) => {
    setShowModal(true);
    setFileId(id);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  if (!props.files || props.files.length === 0) {
    return <div className={fileListModule.empty}>No files found</div>;
  }

  return (
    <>
      <ul className={fileListModule.fileList}>
        <li key="header" className={fileListModule.fileListHeader}>
          {props.showSelection && <div className={fileListModule.fileCheckbox}></div>}
          <div className={fileListModule.fileName}>Name</div>
          <div className={fileListModule.fileSize}>Size</div>
          <div className={fileListModule.fileModified}>Upload Date</div>
          <div className={fileListModule.fileDeleteHeader}>&nbsp;</div>
        </li>
        {props.files.map((file) => (
          <li key={file.id} className={fileListModule.fileListItem}>
            {props.showSelection && (
              <div className={fileListModule.fileCheckbox}>
                <input
                  type="checkbox"
                  name="jobFile"
                  value={file.id}
                  className={fileListModule.fileCheckboxInput}
                  onChange={() => props.checkboxChangeEvent?.()}
                />
              </div>
            )}
            <div className={fileListModule.fileName}>
              <div className={fileListModule.fileColHead}>File</div>
              <div className={fileListModule.fileColBody}>{file.name}</div>
            </div>
            {file.size && (
              <div className={fileListModule.fileSize}>
                <div className={fileListModule.fileColHead}>Size</div>
                <div className={fileListModule.fileColBody}>{file.size}B</div>
              </div>
            )}
            {file.uploadDate && (
              <div className={fileListModule.fileModified}>
                <div className={fileListModule.fileColHead}>Upload Date</div>
                <div className={fileListModule.fileColBody}>
                  {new Date(file.uploadDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
              </div>
            )}
            <div className={fileListModule.fileButton}>
              <div className={fileListModule.fileColHead}></div>
              <div className={fileListModule.fileColBody}>
                <button className={fileListModule.deleteFile} onClick={() => openModal(file.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showModal &&
        createPortal(
          <Modal
            title="Delete File"
            type="confirm"
            open="true"
            onClose={closeModal}
            onSubmit={() => {
              removeFileHandler(props.projectId, fileId);
            }}
          >
            <div className={fileListModule.confirmBox}>
              This will permanently delete the file from this project. Are you sure?
            </div>
          </Modal>,
          document.body
        )}
    </>
  );
};

export default FileList;
