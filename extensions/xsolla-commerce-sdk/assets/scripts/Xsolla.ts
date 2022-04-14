// Copyright 2021 Xsolla Inc. All Rights Reserved.

export enum PaymentUiTheme {
    default_light = 0,
	default_dark = 1,
	dark = 2,
	ps4_default_light = 3,
	ps4_default_dark = 4
}

export enum PaymentUiSize {
    small = 0,
	medium = 1,
	large = 2
}

export enum PaymentUiVersion {
	desktop = 0,
	mobile = 1
}

export enum PaymentRedirectCondition {
    none = 0,
	successful = 1,
	successful_or_canceled = 2,
    any = 3
}

export enum PaymentRedirectStatusManual {
    none = 0,
	vc = 1,
	successful = 2,
    successful_or_canceled = 3,
    any = 4
}

export interface XsollaSettings {
    loginId: string;
    projectId: string;
    clientId: number;
    enableSandbox: boolean;
    paymentInterfaceTheme: PaymentUiTheme;
    paymentInterfaceSize: PaymentUiSize;
    paymentInterfaceVersion: PaymentUiVersion;
    redirectPolicySettingsWebGL: RedirectPolicySettings;
    redirectPolicySettingsAndroid: RedirectPolicySettings;
    redirectPolicySettingsIOS: RedirectPolicySettings;
}

export class Xsolla {
    static settings: XsollaSettings;

    static init(settings: XsollaSettings) {
        Xsolla.settings = settings;
    }
}

export interface RedirectPolicySettings {
    useSettingsFromPublisherAccount: boolean;
    returnUrl: string;
    redirectCondition: PaymentRedirectCondition;
    redirectDelay: number;
    redirectStatusManual: PaymentRedirectStatusManual;
    redirectButtonCaption: string;
}
