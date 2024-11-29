import { useState } from 'react';

type Props = {
    disabled?: boolean;
};

export const AddItemForm = (props: Props) => {
    const { disabled } = props;

    const [error, setError] = useState<string | null>(null);
    const [inputText, setInputText] = useState<string>('');

    return (
        <div>
            <input type="text" value={inputText} disabled={disabled} />
            <button disabled={!!error || disabled}>+</button>
            {error && <p>{error}</p>}
        </div>
    );
};
