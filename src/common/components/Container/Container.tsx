import MuiContainer, { ContainerProps } from '@mui/material/Container';

export const Container = (props: ContainerProps) => {
    return <MuiContainer maxWidth={'xl'} component={'section'} {...props} />;
};
