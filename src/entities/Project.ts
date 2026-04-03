import { type FileInfo } from '@entities/File';
import { type Job } from '@entities/Job';

type Project = {
  id: number;
  name: string;
  description: string;
  filesCount: number;
  jobsCount: number;
  createDate: Date;
  Files: FileInfo[] | [];
  Jobs: Job[] | [];
};

export { type Project };
