// Copyright 2021 Xsolla Inc. All Rights Reserved.

export enum XsollaAuthenticationType {
    Jwt = 0,
    Oauth2 = 1
}

export interface XsollaSettings {
    loginId: string;
    projectId: string;
    authType: XsollaAuthenticationType;
    clientId: number;
}

export class Xsolla {
    static settings: XsollaSettings;

    static init(settings: XsollaSettings) {
        Xsolla.settings = settings;
    }
}
