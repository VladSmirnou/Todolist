import { ResultCode } from '../enums/enums';
import { Response } from '../types/types';

export const serverErrorHandler = <T>(data: Response<T>) => {
    if (data.resultCode !== ResultCode.Success) {
        const errorMessage = data.messages[0];
        throw new Error(errorMessage);
    }
};
