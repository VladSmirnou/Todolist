export type Todolist = {
    addedDate: string;
    id: string;
    order: number;
    title: string;
};

export type NewTodolist = {
    item: {
        addedDate: string;
        id: string;
        order: number;
        title: string;
    };
};
