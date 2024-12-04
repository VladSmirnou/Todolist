import { FilterValue } from '@/features/todolists/utils/types/todolist.types';

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
        <div>
            <button
                onClick={() => handleFilterValueChange('all')}
                disabled={disabled}
                style={{
                    backgroundColor:
                        'all' === filterValue ? 'aquamarine' : 'revert',
                }}
            >
                all
            </button>
            <button
                onClick={() => handleFilterValueChange('active')}
                disabled={disabled}
                style={{
                    backgroundColor:
                        'active' === filterValue ? 'aquamarine' : 'revert',
                }}
            >
                active
            </button>
            <button
                onClick={() => handleFilterValueChange('completed')}
                disabled={disabled}
                style={{
                    backgroundColor:
                        'completed' === filterValue ? 'aquamarine' : 'revert',
                }}
            >
                completed
            </button>
        </div>
    );
};
