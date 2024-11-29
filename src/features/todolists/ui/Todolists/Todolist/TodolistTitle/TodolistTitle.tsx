import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';

type Props = {
    disabled: boolean;
};

export const TodolistTitle = (props: Props) => {
    const { disabled } = props;

    return (
        <div>
            <EditableSpan />
            <button disabled={disabled}>x</button>
        </div>
    );
};
