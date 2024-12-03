import { ChangeEvent, useState } from 'react';

type Props = {
    disabled?: boolean;
    onAddItem: (itemName: string) => void;
};
// tasksStatus is common for all tasks,
// but must be common only for one todolist
// that these tasks belong to

export const AddItemForm = (props: Props) => {
    const { disabled, onAddItem } = props;

    const [inputText, setInputText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setInputText(e.target.value);
    };

    const handleAddItem = () => {
        if (!inputText.trim()) {
            setError('Title cannot be empty!');
        } else {
            onAddItem(inputText);
            setInputText('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputText}
                onChange={handleChange}
                disabled={disabled}
            />
            <button disabled={!!error || disabled} onClick={handleAddItem}>
                +
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
