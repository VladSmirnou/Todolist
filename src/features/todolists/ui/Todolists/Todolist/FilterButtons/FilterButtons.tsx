import { FilterValue } from '../Tasks/Tasks';

type Props = {
    filterValue: FilterValue;
    disabled: boolean;
};

export const FilterButtons = (props: Props) => {
    const { filterValue, disabled } = props;
    return (
        <div>
            <button
                disabled={disabled}
                style={{
                    backgroundColor:
                        'all' === filterValue ? 'aquamarine' : 'revert',
                }}
            >
                all
            </button>
            <button
                disabled={disabled}
                style={{
                    backgroundColor:
                        'active' === filterValue ? 'aquamarine' : 'revert',
                }}
            >
                active
            </button>
            <button
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
