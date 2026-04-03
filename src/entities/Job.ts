interface Job {
    id: number;
    status: string;
    progress: number;
    createdAt: Date;
    CompletedAt: Date;
}

export { type Job };