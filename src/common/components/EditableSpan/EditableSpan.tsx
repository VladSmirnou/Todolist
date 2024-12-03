import { ChangeEvent, useState } from 'react';

type Props = {
    spanText: string;
    onEdit: (newValue: string) => void;
    disabled?: boolean;
};

export const EditableSpan = (props: Props) => {
    const { spanText, onEdit, disabled } = props;

    const [inputText, setInputText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const handleSetEditModeOn = () => {
        if (!disabled) {
            setInputText(spanText);
            setEditMode(true);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setInputText(e.target.value);
    };

    const handleBlur = () => {
        if (!inputText.trim()) {
            setError('Title cannot be empty!');
        } else {
            setEditMode(false);
            onEdit(inputText);
        }
    };

    return editMode ?
            <div>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                />
                {error && <p>{error}</p>}
            </div>
        :   <span
                onDoubleClick={handleSetEditModeOn}
                style={{ color: disabled ? 'gray' : 'black' }}
            >
                {spanText}
            </span>;
};
