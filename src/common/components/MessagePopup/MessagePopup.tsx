export const MessagePopup = () => {
    const appStatus = 'success' as 'error' | 'success';

    let content;

    if (appStatus === 'error') {
        content = <p style={{ color: 'red' }}>ERROR!</p>;
    }
    if (appStatus === 'success') {
        content = <p style={{ color: 'green' }}>OK!</p>;
    }

    return <div>{content}</div>;
};
