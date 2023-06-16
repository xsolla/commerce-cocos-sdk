// Copyright 2022 Xsolla Inc. All Rights Reserved.

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
	purchase_for_virtual_currency = 1,
	successful = 2,
    successful_or_canceled = 3,
    any = 4
}

export interface XsollaSettings {
    loginId: string;
    projectId: string;
    clientId: number;
    enableSandbox?: boolean;
    enableInAppBrowser?: boolean;
    paymentUISettingsWebGL?:PaymentUISettings;
    paymentUISettingsAndroid?:PaymentUISettings;
    paymentUISettingsIOS?:PaymentUISettings;
    redirectPolicySettingsWebGL?: RedirectPolicySettings;
    redirectPolicySettingsAndroid?: RedirectPolicySettings;
    redirectPolicySettingsIOS?: RedirectPolicySettings;
}

export class Xsolla {
    static settings: XsollaSettings;

    static init(settings: XsollaSettings) {
        if (settings.enableInAppBrowser == null)
            settings.enableInAppBrowser = true;

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

export interface PaymentUISettings {
    theme?: string;
    size?: PaymentUiSize;
    version?: PaymentUiVersion;
}