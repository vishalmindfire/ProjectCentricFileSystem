import { useNavigate, useParams } from 'react-router';
import { createPortal } from 'react-dom';
import FileList from '@components/FileList';
import JobList from '@components/JobList';
import projectModule from '@styles/project.module.css';
import { ProjectContext } from '@contexts/ProjectContext';
import { useContext, useEffect, useState, useCallback } from 'react';
import { getProject } from '@services/projectService';
import { getFiles } from '@services/fileService';
import { getJobs } from '@services/jobService';
import Spinner from '@components/Spinner';
import { useProject } from '@hooks/useProject';
import { useFiles } from '@hooks/useFiles';
import { useJobs } from '@hooks/useJobs';
import InputBox from '@components/InputBox';
import type { FileInfo } from '@entities/File';
import { createJob } from '@services/jobService';
import Modal from '@components/Modal';

export default function ProjectPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const files = useFiles(projectId);
  const jobs = useJobs(projectId);
  const { project, isLoading } = useProject(projectId);
  const { dispatch } = useContext(ProjectContext);
  const [jobFiles, setJobFiles] = useState<FileInfo['id'][]>([]);
  const [missingFiles, setMissingFiles] = useState<FileInfo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      await getProject(projectId, dispatch);
      await getFiles(projectId, dispatch);
      await getJobs(projectId, dispatch);
    };
    fetchFiles();
  }, [projectId, dispatch]);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const fileUploadHandler = () => {
    navigate('files');
  };
  const createJobHandler = async () => {
    const data = await createJob(projectId, jobFiles, dispatch, false).catch((error) => {
      setModalType('message');
      setModalMessage(error.message);
      openModal();
    });
    if (data?.missingFiles) {
      setMissingFiles(data.missingFiles);
      setModalType('confirm');
      openModal();
    }
  };
  const createJobHandlerForced = async () => {
    closeModal();
    await createJob(projectId, jobFiles, dispatch, true);
  };
  const filesCheckedChangeHandler = useCallback(() => {
    const checkedBoxes = document.querySelectorAll('input[name="jobFile"]:checked');
    const values = Array.from(checkedBoxes).map((box) => Number((box as HTMLInputElement).value));
    setJobFiles(values);
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        project.length && (
          <div className={projectModule.projectDetails}>
            <div className={projectModule.projectDetail}>
              <div className={projectModule.name}>
                <h1>{project[0].name}</h1>
              </div>
              <div className={projectModule.description}>
                <p>{project[0].description}</p>
              </div>
            </div>
            <section className={projectModule.projectFilesContainer}>
              <div className={projectModule.projectFilesHeader}>
                <h2 className={projectModule.projectFilesTitle}>Files</h2>
                <span className={projectModule.projectFilesCount}>{project[0].filesCount}</span>
              </div>
              <div className={projectModule.projectFilesSection}>
                <div className={projectModule.projectFilesBody}>
                  <FileList
                    files={files}
                    projectId={projectId}
                    isLoading={isLoading}
                    showSelection={true}
                    checkboxChangeEvent={filesCheckedChangeHandler}
                  />
                </div>
                <div className={projectModule.projectFilesUpload}>
                  <div className={projectModule.projectJobCreateBox}>
                    {jobFiles.length === 0 && (
                      <div className={projectModule.projectJobCreateBoxTitle}>
                        Select Files to create a job
                      </div>
                    )}
                    <InputBox
                      type="button"
                      onClick={createJobHandler}
                      value="Create new job"
                      disabled={jobFiles.length === 0}
                    />
                  </div>
                  <InputBox type="button" onClick={fileUploadHandler} value="Add new files" />
                </div>
              </div>
            </section>

            <section className={projectModule.projectJobsContainer}>
              <div className={projectModule.projecJosSection}>
                <div className={projectModule.projectJobsHeader}>
                  <h2>Jobs</h2>
                </div>
                <div className={projectModule.projectJobsBody}>
                  <JobList jobs={jobs} projectId={projectId} isLoading={isLoading} />
                </div>
              </div>
            </section>
          </div>
        )
      )}
      {showModal &&
        createPortal(
          <Modal
            title="Delete File"
            type={modalType}
            open="true"
            onClose={closeModal}
            onSubmit={() => {
              createJobHandlerForced();
            }}
          >
            {modalType === 'confirm' && (
              <div className={projectModule.confirmBox}>
                <div className={projectModule.confirmBoxContent}>
                  This files are missing and hence cannot be archived.
                </div>
                <ul className={projectModule.missingFileList}>
                  {missingFiles.map((missingFile) => (
                    <li key={missingFile.id} className={projectModule.missingFileItem}>
                      {files.filter((file) => file.id == missingFile.id)[0].name}
                    </li>
                  ))}
                </ul>
                <div>Are you sure you wanna continue?</div>
              </div>
            )}
            {modalType === 'message' && <div>{modalMessage}</div>}
          </Modal>,
          document.body
        )}
    </>
  );
}
