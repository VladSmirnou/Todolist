import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import s from './TodolistTitle.module.css';

type Props = {
    disabled: boolean;
    title: string;
    updateTodo: (title: string) => void;
    deleteTodo: () => void;
};

export const TodolistTitle = (props: Props) => {
    const { disabled, title, updateTodo, deleteTodo } = props;

    return (
        <div className={s.container}>
            <EditableSpan
                onEdit={updateTodo}
                spanText={title}
                disabled={disabled}
                className={disabled ? s.taskTitleDisabled : undefined}
                component={'h3'}
                variant={'h5'}
            />
            <IconButton
                disabled={disabled}
                onClick={deleteTodo}
                aria-label="delete"
                size="medium"
            >
                <DeleteIcon fontSize="inherit" />
            </IconButton>
        </div>
    );
};
