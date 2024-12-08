import Button from '@mui/material/Button';
import { FilterValue } from '@/features/todolists/utils/types/todolist.types';
import s from './FilterButtons.module.css';

type Props = {
    filterValue: FilterValue;
    disabled: boolean;
    onFilterValueChange: (nextFilterValue: FilterValue) => void;
};

export const FilterButtons = (props: Props) => {
    const { filterValue, disabled, onFilterValueChange } = props;

    const handleFilterValueChange = (nextFilterValue: FilterValue) => {
        onFilterValueChange(nextFilterValue);
    };

    return (
        <div className={s.container}>
            <Button
                variant={'all' === filterValue ? 'contained' : 'outlined'}
                onClick={() => handleFilterValueChange('all')}
                disabled={disabled}
            >
                all
            </Button>
            <Button
                variant={'active' === filterValue ? 'contained' : 'outlined'}
                onClick={() => handleFilterValueChange('active')}
                disabled={disabled}
            >
                active
            </Button>
            <Button
                variant={'completed' === filterValue ? 'contained' : 'outlined'}
                onClick={() => handleFilterValueChange('completed')}
                disabled={disabled}
            >
                completed
            </Button>
        </div>
    );
};
