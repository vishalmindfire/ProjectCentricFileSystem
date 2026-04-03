import fileListModule from "@styles/fileList.module.css";
import { type FileInfo } from "@entities/File";
import { deleteFile } from "@services/projectService";
import { ProjectContext } from "@contexts/ProjectContext";
import { useContext, useEffect } from "react";

type FileListProps = {
    files: FileInfo[];
    projectId: number;
    isLoading: boolean;
};

const FileList = (props: FileListProps) => {
    const { dispatch } = useContext(ProjectContext);
    //const dateFormatter = new Intl.DateTimeFormat("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
    const removeFileHandler = (id: number, fileId : number) => {
        deleteFile(id, fileId, dispatch);
    }

    useEffect( () => {

    },[props.files])

    if (!props.files || props.files.length === 0) {
        return <div className={fileListModule.empty}>No files found</div>;
    }
 
    return (
        <ul className={fileListModule.fileList}>
            {props.files.map((file) => (
                <li
                    key={file.id}
                    className={fileListModule.fileListItem}
                >
                    <div className={fileListModule.fileName}>{file.name}</div>
                    {file.size && <div className={fileListModule.fileSize}>{file.size}</div>}
                    {file.uploadDate && <div className={fileListModule.Filemodified}>{file.uploadDate.toString()}</div>}
                    <button className={fileListModule.deleteFile} onClick={() => removeFileHandler(props.projectId, file.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
};

export default FileList;