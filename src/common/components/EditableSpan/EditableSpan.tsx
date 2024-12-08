import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography, { TypographyProps } from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

type Props = {
    spanText: string;
    onEdit: (newValue: string) => void;
    disabled?: boolean;
    navigateToLink?: string;
} & TypographyProps;

export const EditableSpan = (props: Props) => {
    const { spanText, onEdit, disabled, navigateToLink, ...rest } = props;

    const navigate = useNavigate();

    const [inputText, setInputText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const clicksCount = useRef(0);

    const handleClick = () => {
        if (!disabled) {
            if (clicksCount.current === 0) {
                setTimeout(() => {
                    const clicks = clicksCount.current;
                    clicksCount.current = 0;
                    if (navigateToLink && clicks < 2) {
                        navigate(navigateToLink);
                    }
                    if (clicks >= 2) {
                        setInputText(spanText);
                        setEditMode(true);
                    }
                }, 200);
            }
            clicksCount.current++;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (error) setError(null);
        setInputText(e.target.value);
    };

    const handleBlur = () => {
        const nextInputText = inputText.trim();
        if (!nextInputText) {
            setError('Title cannot be empty!');
        } else if (nextInputText === spanText) {
            setEditMode(false);
        } else {
            setEditMode(false);
            onEdit(inputText);
        }
    };

    return editMode ?
            <TextField
                autoFocus
                size={'small'}
                value={inputText}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                error={!!error}
                helperText={error}
            />
        :   <Typography onClick={handleClick} {...rest}>
                {spanText}
            </Typography>;
};
