import { ChangeEvent, useState } from 'react';

type Props = {
    disabled?: boolean;
    onAddItem: (itemName: string) => void;
};

export const AddItemForm = (props: Props) => {
    const { disabled, onAddItem } = props;

    const [inputText, setInputText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };

    const handleAddItem = () => {
        onAddItem(inputText);
        setInputText('');
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
            {error && <p>{error}</p>}
        </div>
    );
};
