export enum TaskStatusCodes {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriority {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export enum ResultCode {
    Success = 0,
    Error = 1,
    CaptchaError = 10,
}

export enum TodolistsStatus {
    IDLE = 'idle',
    INITIAL_LOADING = 'initialLoading',
    LOADING = 'loading',
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export enum AppStatus {
    IDLE = 'idle',
    FAILED = 'failed',
    SUCCEEDED = 'succeeded',
    PENDING = 'pending',
}
