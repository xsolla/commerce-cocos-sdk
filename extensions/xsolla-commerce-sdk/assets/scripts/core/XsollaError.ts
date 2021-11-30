// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError } from "./XsollaHttpUtil";

export class XsollaError {
    static handleError(onError:(error:CommerceError) => void): (requestError:XsollaHttpError) => void {
        return requestError => {
            let commerceError: CommerceError = {
                code: requestError.errorCode,
                description: requestError.errorMessage,
                status: requestError.statusCode
            };
            onError?.(commerceError);
        };
    }
}

export interface CommerceError {
    status?: number,
    code: number,
    description: string
}