// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { XsollaHttpError } from "./XsollaHttpUtil";

export function handleCommerceError(onError:(error:CommerceError) => void): (requestError:XsollaHttpError) => void {
    return requestError => {
        let commerceError: CommerceError = {
            code: requestError.errorCode,
            description: requestError.errorMessage,
            status: requestError.statusCode
        };
        onError?.(commerceError);
    };
}

export function handleLoginError(onError:(error:LoginError) => void): (requestError:XsollaHttpError) => void {
    return requestError => {
        let loginError: LoginError = {
            code: requestError.code,
            description: requestError.description
        };
        onError?.(loginError);
    };
}

export interface CommerceError {
    status?: number,
    code: number,
    description: string
}

export interface LoginError {
    code: string,
    description: string
}