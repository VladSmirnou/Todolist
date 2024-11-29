type Props = {
    paginationPage: number;
    disabled: boolean;
};

export const TasksPagination = (props: Props) => {
    const { paginationPage, disabled } = props;

    return (
        <div
            style={{ color: disabled ? 'red' : 'black' }}
        >{`<- ${paginationPage} ->`}</div>
    );
};
