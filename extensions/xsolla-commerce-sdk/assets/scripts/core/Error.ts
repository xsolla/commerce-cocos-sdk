// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { HttpError } from "./HttpUtil";

export function handleCommerceError(onError:(error:CommerceError) => void): (requestError:HttpError) => void {
    return requestError => {
        let commerceError: CommerceError = {
            code: requestError.errorCode,
            description: requestError.errorMessage,
            status: requestError.statusCode
        };
        onError?.(commerceError);
    };
}

export function handleLoginError(onError:(error:LoginError) => void): (requestError:HttpError) => void {
    return requestError => {
        let loginError: LoginError = {
            code: requestError.code,
            description: requestError.description
        };
        onError?.(loginError);
    };
}

export function handleSubscriptionError(onError:(error:SubscriptionError) => void): (requestError:HttpError) => void {
    return requestError => {
        let subscriptionError: SubscriptionError = {
            code: requestError.code,
            description: requestError.description
        };
        onError?.(subscriptionError);
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

export interface SubscriptionError {
    code: string,
    description: string
}