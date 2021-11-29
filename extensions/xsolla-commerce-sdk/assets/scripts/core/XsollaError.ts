// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError } from "./XsollaHttpUtil";

export class XsollaError {
    static handleError(onError:(error:CommonError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let commonError: CommonError = {
                code: requestError.errorCode,
                description: requestError.errorMessage,
                status: requestError.statusCode
            };
            onError?.(commonError);
        };
    }
}

export interface CommonError {
    status?: number,
    code: number,
    description: string
}