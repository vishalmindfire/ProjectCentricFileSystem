import { useState, useEffect, type SetStateAction } from 'react';
import dragAndDropModule from '@styles/dragAndDrop.module.css';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';
import cx from 'classnames';

interface Props {
  onSelectedFiles: React.Dispatch<SetStateAction<File[] | []>>;
  dropBoxType: string;
}

const DragAndDrop = ({ onSelectedFiles, dropBoxType }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange: React.ChangeEventHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles: FileList | null = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDropEvent: React.MouseEventHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles: FileList = event.dataTransfer.files;
    if (droppedFiles.length) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles: File[]) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFiles = (index: number) => {
    setFiles((prevFiles: File[]) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onSelectedFiles(files);
  }, [onSelectedFiles, files]);

  const uploaderClass = cx(dragAndDropModule.documentUploader, dragAndDropModule.uploadBox, {
    [dragAndDropModule.active]: files.length > 0,
  });
  return (
    <section
      className={cx(dragAndDropModule.dragDrop, {
        [dragAndDropModule.dragDropDefault]: dropBoxType == 'DEFAULT',
      })}
    >
      <div
        className={uploaderClass}
        onDrop={handleDropEvent}
        onDragOver={(event) => event.preventDefault()}
      >
        <div className={dragAndDropModule.uploadInfo}>
          <AiOutlineCloudUpload />
          <div>
            <p>Drag and drop your files here</p>
            <p>Supported files: .JPG, .PNG, .JPEEG, .PDF, .DOCX, .PPTX, .TXT, .XLSX</p>
          </div>
        </div>

        <input
          type="file"
          hidden
          id="browse"
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx,.txt,.xlsx,.mp4"
          multiple
        />
        <label htmlFor="browse" className={dragAndDropModule.browseBtn}>
          Browse files
        </label>
      </div>

      <div className={dragAndDropModule.uploadingFilesSection}>
        {files.length > 0 && (
          <div className={dragAndDropModule.fileList}>
            <div className={dragAndDropModule.fileListContainer}>
              {files.map((file, index) => (
                <div className={dragAndDropModule.fileItem} key={index}>
                  <div className={dragAndDropModule.fileInfo}>
                    <p>{file.name}</p>
                    {/* <p>{file.type}</p> */}
                  </div>
                  <div className={dragAndDropModule.fileActions}>
                    <MdClear onClick={() => handleRemoveFiles(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DragAndDrop;
