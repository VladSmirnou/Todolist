import Button from '@mui/material/Button';
import s from './FilterButtons.module.css';
import { FilterValue } from '@/features/todolists/utils/enums/enums';

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
                variant={
                    filterValue === FilterValue.ALL ? 'contained' : 'outlined'
                }
                onClick={() => handleFilterValueChange(FilterValue.ALL)}
                disabled={disabled}
            >
                all
            </Button>
            <Button
                variant={
                    filterValue === FilterValue.ACTIVE ?
                        'contained'
                    :   'outlined'
                }
                onClick={() => handleFilterValueChange(FilterValue.ACTIVE)}
                disabled={disabled}
            >
                active
            </Button>
            <Button
                variant={
                    filterValue === FilterValue.COMPLETED ?
                        'contained'
                    :   'outlined'
                }
                onClick={() => handleFilterValueChange(FilterValue.COMPLETED)}
                disabled={disabled}
            >
                completed
            </Button>
        </div>
    );
};
