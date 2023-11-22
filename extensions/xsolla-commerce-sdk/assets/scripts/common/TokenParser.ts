// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { Token } from "../api/XsollaAuth";
 
export class TokenUtils {
    static getTokenParameter(token: Token, parameterName: string): any {
        let tokenPayload = TokenUtils.parseTokenPayload(token);
        if(tokenPayload.hasOwnProperty(parameterName)) {
            return tokenPayload[parameterName];
        }
        return null;
    }

    static isTokenExpired(token: Token) {
        let expirationTime = TokenUtils.getTokenParameter(token, 'exp') * 1000;
        let currentTime = new Date().getTime();
        return currentTime > expirationTime;
    }

    static parseTokenPayload(token: Token): any {
        let payload = token.access_token.split('.')[1];
        return JSON.parse(atob(payload));
    }
}