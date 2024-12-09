import { TodolistSkeleton } from './Skeleton/Skeleton';
import s from './Skeletons.module.css';

type Props = {
    amount: number;
};

export const TodolistsSkeletons = (props: Props) => {
    const { amount } = props;

    const skeletons: Array<JSX.Element> = [];
    for (let i = 0; i < amount; i++) {
        skeletons.push(<TodolistSkeleton key={i} />);
    }

    return <div className={s.container}>{skeletons}</div>;
};
