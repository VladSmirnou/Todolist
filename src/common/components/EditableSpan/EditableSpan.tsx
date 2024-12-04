import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    spanText: string;
    onEdit: (newValue: string) => void;
    disabled?: boolean;
    navigateToLink?: string;
};

export const EditableSpan = (props: Props) => {
    const { spanText, onEdit, disabled, navigateToLink } = props;

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
                        return;
                    } else if (clicks >= 2) {
                        setInputText(spanText);
                        setEditMode(true);
                        return;
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
                onClick={handleClick}
                style={{ color: disabled ? 'gray' : 'black' }}
            >
                {spanText}
            </span>;
};
