import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';

type Props = {
    disabled?: boolean;
    onAddItem: (itemName: string) => void;
    placeholder: string;
    // className?: string;
};

export const AddItemForm = (props: Props) => {
    const { disabled, onAddItem, placeholder } = props;

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
            <TextField
                size={'small'}
                value={inputText}
                onChange={handleChange}
                disabled={disabled}
                error={!!error}
                label={placeholder}
                helperText={error}
            />
            <IconButton
                disabled={!!error || disabled}
                onClick={handleAddItem}
                aria-label="add"
                color="primary"
            >
                <AddBoxIcon fontSize="inherit" />
            </IconButton>
        </div>
    );
};
