import classNames from 'classnames/bind';

export const bindClasses = (classes: { [key: string]: string }) => {
    return classNames.bind(classes);
};
