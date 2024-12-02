import { ChangeEvent, useState } from 'react';

type Props = {
    spanText: string;
    onEdit: (newValue: string) => void;
};

export const EditableSpan = (props: Props) => {
    const { spanText, onEdit } = props;

    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);

    const handleSetEditModeOn = () => {
        setInputText(spanText);
        setEditMode(true);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleBlur = () => {
        setEditMode(false);
        onEdit(inputText);
    };

    return editMode ?
            <input
                type="text"
                value={inputText}
                onChange={handleChange}
                onBlur={handleBlur}
                autoFocus
            />
        :   <span onDoubleClick={handleSetEditModeOn}>{spanText}</span>;
};
