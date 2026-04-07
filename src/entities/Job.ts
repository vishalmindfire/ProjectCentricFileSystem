type jobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
interface Job {
  id: number;
  status: jobStatus;
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

export { type Job };
