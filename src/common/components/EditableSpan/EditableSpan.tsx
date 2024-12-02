import { AddItemForm } from '../AddItemForm/AddItemForm';

type Props = {
    spanText: string;
};

export const EditableSpan = (props: Props) => {
    const { spanText } = props;

    const editing = false;
    return editing ? <AddItemForm /> : <span>{spanText}</span>;
};
