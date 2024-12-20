export enum TasksStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    FAILURE = 'failure',
    INITIAL_LOADING = 'initialLoading',
    DELETING_TASK = 'deleting',
}

export enum FilterValue {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed',
}

export enum TodolistStatus {
    IDLE = 'idle',
    UPDATING = 'updating',
    DELETING = 'deleting',
}
