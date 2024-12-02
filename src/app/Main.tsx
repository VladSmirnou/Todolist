import { AddItemForm } from '@/common/components/AddItemForm/AddItemForm';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists';

export const Main = () => {
    return (
        <div style={{ backgroundColor: 'yellow' }}>
            <AddItemForm />
            <Todolists />
        </div>
    );
};
