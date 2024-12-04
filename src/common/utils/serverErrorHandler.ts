import { Response } from '../types/types';

export const serverErrorHandler = <T>(data: Response<T>) => {
    if (data.resultCode !== 0) {
        const errorMessage = data.messages[0];
        throw new Error(errorMessage);
    }
};
