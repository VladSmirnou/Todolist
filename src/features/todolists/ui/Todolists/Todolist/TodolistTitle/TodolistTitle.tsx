import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';

type Props = {
    disabled: boolean;
    title: string;
};

export const TodolistTitle = (props: Props) => {
    const { disabled, title } = props;

    return (
        <div>
            <EditableSpan spanText={title} />
            <button disabled={disabled}>x</button>
        </div>
    );
};
