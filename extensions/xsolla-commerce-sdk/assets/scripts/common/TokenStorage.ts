// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { sys } from 'cc';
import { Token } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';

export class TokenStorage {

    static token: Token;

    static saveToken(newToken: Token, rememberMe: boolean = false) {
        TokenStorage.token = newToken;
        if(rememberMe) {
            sys.localStorage.setItem('xsolla_token', JSON.stringify(TokenStorage.token));
        }
        else {
            sys.localStorage.removeItem('xsolla_token');
        }
    }

    static getToken() : Token {
        if(TokenStorage.token == null) {
            TokenStorage.token = JSON.parse(sys.localStorage.getItem('xsolla_token'));
        }
        return TokenStorage.token;
    }

    static clearToken() {
        TokenStorage.token = null;
        sys.localStorage.removeItem('xsolla_token');
    }
}
