// Copyright 2021 Xsolla Inc. All Rights Reserved.

export enum XsollaAuthenticationType {
    Jwt = 0,
    Oauth2 = 1
}

export enum XsollaPublishingPlatform {
    playstation_network = 0,
	xbox_live = 1,
	xsolla = 2,
	pc_standalone = 3,
	nintendo_shop = 4,
	google_play = 5,
	app_store_ios = 6,
	android_standalone = 7,
	ios_standalone = 8,
	android_other = 9,
	ios_other = 10,
	pc_other = 11
}

export interface XsollaSettings {
    loginId: string;
    projectId: string;
    authType: XsollaAuthenticationType;
    clientId: number;
    enableSandbox: boolean;
}

export class Xsolla {
    static settings: XsollaSettings;

    static init(settings: XsollaSettings) {
        Xsolla.settings = settings;
    }
}
