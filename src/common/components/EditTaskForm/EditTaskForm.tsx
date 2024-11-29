export const EditTaskForm = () => {
    return (
        <section>
            <form>
                <input type="text" defaultValue={'task title'} />
                <div>
                    <button type="submit">update task</button>
                    <button type="button">close</button>
                </div>
            </form>
        </section>
    );
};
