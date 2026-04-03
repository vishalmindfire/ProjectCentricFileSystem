import { useParams } from 'react-router';
import FileList from '@components/FileList';
import projectModule from '@styles/project.module.css';
import { ProjectContext } from '@contexts/ProjectContext';
import { useContext, useEffect } from 'react';
import { getFiles, getProject } from '@services/projectService';
import Spinner from '@components/Spinner';
import { useProject } from '@hooks/useProject';
import { useFiles } from '@hooks/useFiles';
import InputBox from '@components/InputBox';

export default function ProjectPage() {
    const { id } = useParams();
    const projectId = Number(id);
    const files = useFiles(projectId);
    const { project, isLoading } = useProject(projectId);
    const { dispatch } = useContext(ProjectContext);
    
    useEffect(() => {
        const fetchFiles = async() => {
            await getProject(projectId, dispatch);
            await getFiles(projectId, dispatch);
        }
        fetchFiles();    
    },[isLoading])

    return (
        <>        
        { isLoading ? <Spinner/> : project.length && 
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
                        <span className={projectModule.projectFilesCount}>
                            {project[0].filesCount}
                        </span>
                    </div>
                    <div className={projectModule.projectFilesSettings}>
                        <InputBox type='button' value='Add Files'/>
                    </div>
                    <div className={projectModule.projectFilesSection}>
                        <div className={projectModule.projectFilesBody}>
                            <FileList files={files} projectId={projectId} isLoading={isLoading}></FileList>
                        </div>
                    </div>
                </section>
                
                <section className={projectModule.projectJobsContainer}>
                    <div className={projectModule.projecJosSection}>
                        <h2>Jobs</h2>
                        
                    </div>
                </section>
            </div>
        }
        </>
    );
}