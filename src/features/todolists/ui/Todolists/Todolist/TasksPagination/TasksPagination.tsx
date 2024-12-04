import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

type Props = {
    paginationPage: number;
    disabled: boolean;
    amountOfPages: number;
    onSetPaginationPage: (nextPage: number) => void;
};

export const TasksPagination = (props: Props) => {
    const { paginationPage, amountOfPages, onSetPaginationPage, disabled } =
        props;

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        onSetPaginationPage(value);
    };

    return (
        <Stack spacing={2}>
            <Pagination
                count={amountOfPages}
                page={paginationPage}
                onChange={handleChange}
                disabled={disabled}
            />
        </Stack>
    );
};
