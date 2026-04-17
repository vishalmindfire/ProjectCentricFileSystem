import jobListModule from '@styles/jobList.module.css';
import { type Job } from '@entities/Job';
import { type Project } from '@entities/Project';
import { useEffect, useContext } from 'react';
import { downloadJobData, getJobStatus } from '@services/jobService';
import { ProjectContext } from '@contexts/ProjectContext';

type JobListProps = {
  jobs: Job[];
  projectId: number;
  isLoading: boolean;
};

const JobList = (props: JobListProps) => {
  const { dispatch } = useContext(ProjectContext);
  const downloadHandler = async (projectId: Project['id'], jobId: Job['id']) => {
    const data = await downloadJobData(projectId, jobId);

    if (data?.file && data?.fileName) {
      const url = window.URL.createObjectURL(data.file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', data.fileName);
      document.body.appendChild(link);
      link.click();
      (link.parentNode as HTMLElement).removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    props.jobs.forEach((job) => {
      if (job.status === 'PENDING' || job.status === 'PROCESSING') {
        const interval = setInterval(async () => {
          const res = await getJobStatus(job.id, props.projectId);
          if (res.success && res.jobStatus) {
            const newJob: Job = {
              ...job,
              status: res.jobStatus.status as Job['status'],
              progress: res.jobStatus.progress,
              completedAt: res.jobStatus.completedAt,
            };
            dispatch({
              type: 'UPDATE_JOB',
              payload: { projectId: props.projectId, jobs: [newJob] },
            });
          }
        }, 2000);
        intervals.push(interval);
        console.log(intervals);
      }
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [props.jobs, props.projectId, dispatch]);

  if (!props.jobs || props.jobs.length === 0) {
    return <div className={jobListModule.empty}>No jobs found</div>;
  }

  return (
    <ul className={jobListModule.jobList}>
      <li key="header" className={jobListModule.jobListHeader}>
        <div className={jobListModule.jobId}>Job ID</div>
        <div className={jobListModule.jobStatus}>Status</div>
        <div className={jobListModule.jobProgress}>Progress</div>
        <div className={jobListModule.jobCreatedAt}>Created At</div>
        <div className={jobListModule.jobCompletedAt}>Completed At</div>
        <div className={jobListModule.jobDownloadHeader}>&nbsp;</div>
      </li>
      {props.jobs.map((job) => (
        <li key={job.id} className={jobListModule.jobListItem}>
          <div className={jobListModule.jobId}>
            <div className={jobListModule.jobColHead}>Job ID</div>
            <div className={jobListModule.jobColBody}>{job.id}</div>
          </div>
          <div className={jobListModule.jobStatus}>
            <div className={jobListModule.jobColHead}>Status</div>
            <div className={jobListModule.jobColBody}>{job.status}</div>
          </div>
          <div className={jobListModule.jobProgress}>
            <div className={jobListModule.jobColHead}>Progress</div>
            <div className={jobListModule.jobColBody}>{job.progress}</div>
          </div>
          <div className={jobListModule.jobCreatedAt}>
            <div className={jobListModule.jobColHead}>Created At</div>
            <div className={jobListModule.jobColBody}>
              {new Date(job.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>
          <div className={jobListModule.jobCompletedAt}>
            <div className={jobListModule.jobColHead}>Completed At</div>
            <div className={jobListModule.jobColBody}>
              {job.completedAt &&
                new Date(job.completedAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
            </div>
          </div>
          <div className={jobListModule.jobDownload}>
            <div className={jobListModule.jobColHead}></div>
            <div className={jobListModule.jobColBody}>
              <button
                className={jobListModule.jobDownloadButton}
                onClick={() => downloadHandler(props.projectId, job.id)}
                disabled={job.status !== 'COMPLETED'}
              >
                Download
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default JobList;
