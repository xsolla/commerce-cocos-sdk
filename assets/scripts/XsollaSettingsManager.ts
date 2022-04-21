// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Enum} from 'cc';
import { XsollaSettings, Xsolla, PaymentUiTheme, PaymentUiSize, PaymentUiVersion, PaymentRedirectCondition, PaymentRedirectStatusManual, RedirectPolicySettings, PaymentUISettings } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
const { ccclass, property, disallowMultiple, type  } = _decorator;
 
@ccclass('XsollaSettingsManager')
@disallowMultiple(true)
export class XsollaSettingsManager extends Component {

    @property({
        displayName: 'Login ID',
        tooltip: 'Login ID in the UUID format from your Publisher Account (required)',
        group: 'General'
    })
    loginId: string = '026201e3-7e40-11ea-a85b-42010aa80004';

    @property({
        displayName: 'Project ID',
        tooltip: 'Project ID from your Publisher Account (required)',
        group: 'General'
    })
    projectId: string = '77640';

    @property ({
        displayName: 'Client ID',
        tooltip: 'Client ID from your Publisher Account',
        group: 'General',
    })
    clientId: number = 57;

    @property ({
        displayName: 'Enable Sandbox',
        tooltip: 'Enable to test the payment process: sandbox-secure.xsolla.com will be used instead of secure.xsolla.com.',
        group: 'General'
    })
    enableSandbox: boolean = true;

    @property ({
        displayName: 'Payment UI Theme',
        tooltip: 'User interface theme for the payment interface.',
        group: {name: 'Paystation UI WebGL', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiTheme))
    paymentInterfaceThemeWebGL: PaymentUiTheme = PaymentUiTheme.ps4_default_dark;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI WebGL', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiSize))
    paymentInterfaceSizeWebGL: PaymentUiSize = PaymentUiSize.medium;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI WebGL', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiVersion))
    paymentInterfaceVersionWebGL: PaymentUiVersion = PaymentUiVersion.desktop;

    @property ({
        displayName: 'Payment UI Theme',
        tooltip: 'User interface theme for the payment interface.',
        group: {name: 'Paystation UI Android', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiTheme))
    paymentInterfaceThemeAndroid: PaymentUiTheme = PaymentUiTheme.ps4_default_dark;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI Android', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiSize))
    paymentInterfaceSizeAndroid: PaymentUiSize = PaymentUiSize.medium;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI Android', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiVersion))
    paymentInterfaceVersionAndroid: PaymentUiVersion = PaymentUiVersion.mobile;

    @property ({
        displayName: 'Payment UI Theme',
        tooltip: 'User interface theme for the payment interface.',
        group: {name: 'Paystation UI IOS', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiTheme))
    paymentInterfaceThemeIOS: PaymentUiTheme = PaymentUiTheme.ps4_default_dark;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI IOS', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiSize))
    paymentInterfaceSizeIOS: PaymentUiSize = PaymentUiSize.medium;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: {name: 'Paystation UI IOS', id: 'Paystation UI'}
    })
    @type(Enum(PaymentUiVersion))
    paymentInterfaceVersionIOS: PaymentUiVersion = PaymentUiVersion.mobile;

    @property ({
        displayName: 'Use settings from publisher account',
        tooltip: 'Disable to override default redirect policy for payments.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    UseSettingsFromPublisherAccountWebGL: boolean = true;

    @property ({
        displayName: 'Return Url',
        tooltip: 'Page to redirect user to after the payment.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    returnUrlWebGL: string = '';

    @property ({
        displayName: 'Redirect Condition',
        tooltip: 'Payment status that triggers user redirect to the return URL.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectCondition))
    redirectConditionWebGL: PaymentRedirectCondition = PaymentRedirectCondition.none;

    @property ({
        displayName: 'Redirect Delay',
        tooltip: 'Delay after which the user will be automatically redirected to the return URL.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    redirectDelayWebGL: number = 0;

    @property ({
        displayName: 'Redirect Status Manual',
        tooltip: 'Payment status triggering the display of a button clicking which redirects the user to the return URL.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectStatusManual))
    redirectStatusManualWebGL: PaymentRedirectStatusManual = PaymentRedirectStatusManual.none;

    @property ({
        displayName: 'Redirect Button Caption',
        tooltip: 'Redirect button caption.',
        group: {name: 'Redirect Policy WebGL', id: 'Redirect Policy'}
    })
    redirectButtonCaptionWebGL: string = '';

    @property ({
        displayName: 'Use settings from publisher account',
        tooltip: 'Disable to override default redirect policy for payments.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    UseSettingsFromPublisherAccountAndroid: boolean = true;

    @property ({
        displayName: 'Return Url',
        tooltip: 'Page to redirect user to after the payment.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    returnUrlAndroid: string = '';

    @property ({
        displayName: 'Redirect Condition',
        tooltip: 'Payment status that triggers user redirect to the return URL.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectCondition))
    redirectConditionAndroid: PaymentRedirectCondition = PaymentRedirectCondition.none;

    @property ({
        displayName: 'Redirect Delay',
        tooltip: 'Delay after which the user will be automatically redirected to the return URL.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    redirectDelayAndroid: number = 0;

    @property ({
        displayName: 'Redirect Status Manual',
        tooltip: 'Payment status triggering the display of a button clicking which redirects the user to the return URL.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectStatusManual))
    redirectStatusManualAndroid: PaymentRedirectStatusManual = PaymentRedirectStatusManual.none;

    @property ({
        displayName: 'Redirect Button Caption',
        tooltip: 'Redirect button caption.',
        group: {name: 'Redirect Policy Android', id: 'Redirect Policy'}
    })
    redirectButtonCaptionAndroid: string = '';

    @property ({
        displayName: 'Use settings from publisher account',
        tooltip: 'Disable to override default redirect policy for payments.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    UseSettingsFromPublisherAccountIOS: boolean = true;

    @property ({
        displayName: 'Return Url',
        tooltip: 'Page to redirect user to after the payment.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    returnUrlIOS: string = '';

    @property ({
        displayName: 'Redirect Condition',
        tooltip: 'Payment status that triggers user redirect to the return URL.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectCondition))
    redirectConditionIOS: PaymentRedirectCondition = PaymentRedirectCondition.none;

    @property ({
        displayName: 'Redirect Delay',
        tooltip: 'Delay after which the user will be automatically redirected to the return URL.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    redirectDelayIOS: number = 0;

    @property ({
        displayName: 'Redirect Status Manual',
        tooltip: 'Payment status triggering the display of a button clicking which redirects the user to the return URL.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    @type(Enum(PaymentRedirectStatusManual))
    redirectStatusManualIOS: PaymentRedirectStatusManual = PaymentRedirectStatusManual.none;

    @property ({
        displayName: 'Redirect Button Caption',
        tooltip: 'Redirect button caption.',
        group: {name: 'Redirect Policy IOS', id: 'Redirect Policy'}
    })
    redirectButtonCaptionIOS: string = '';

    start() {

        let redirectPolicySettingsWebGL: RedirectPolicySettings = {
            useSettingsFromPublisherAccount: this.UseSettingsFromPublisherAccountWebGL,
            returnUrl: this.returnUrlWebGL,
            redirectCondition: this.redirectConditionWebGL,
            redirectDelay: this.redirectDelayWebGL,
            redirectStatusManual: this.redirectStatusManualWebGL,
            redirectButtonCaption: this.redirectButtonCaptionWebGL
        };

        let redirectPolicySettingsAndroid: RedirectPolicySettings = {
            useSettingsFromPublisherAccount: this.UseSettingsFromPublisherAccountAndroid,
            returnUrl: this.returnUrlAndroid,
            redirectCondition: this.redirectConditionAndroid,
            redirectDelay: this.redirectDelayAndroid,
            redirectStatusManual: this.redirectStatusManualAndroid,
            redirectButtonCaption: this.redirectButtonCaptionAndroid
        };

        let redirectPolicySettingsIOS: RedirectPolicySettings = {
            useSettingsFromPublisherAccount: this.UseSettingsFromPublisherAccountIOS,
            returnUrl: this.returnUrlIOS,
            redirectCondition: this.redirectConditionIOS,
            redirectDelay: this.redirectDelayIOS,
            redirectStatusManual: this.redirectStatusManualIOS,
            redirectButtonCaption: this.redirectButtonCaptionIOS
        };

        let paymentUISettingsWebGL: PaymentUISettings = {
            theme: this.paymentInterfaceThemeWebGL,
            size: this.paymentInterfaceSizeWebGL,
            version: this.paymentInterfaceVersionWebGL,
        };

        let paymentUISettingsAndroid: PaymentUISettings = {
            theme: this.paymentInterfaceThemeAndroid,
            size: this.paymentInterfaceSizeAndroid,
            version: this.paymentInterfaceVersionAndroid,
        };

        let paymentUISettingsIOS: PaymentUISettings = {
            theme: this.paymentInterfaceThemeIOS,
            size: this.paymentInterfaceSizeIOS,
            version: this.paymentInterfaceVersionIOS,
        };

        var settings: XsollaSettings = {
            loginId: this.loginId,
            projectId: this.projectId,
            clientId: this.clientId,
            enableSandbox: this.enableSandbox,
            paymentUISettingsWebGL: paymentUISettingsWebGL,
            paymentUISettingsAndroid: paymentUISettingsAndroid,
            paymentUISettingsIOS: paymentUISettingsIOS,
            redirectPolicySettingsWebGL: redirectPolicySettingsWebGL,
            redirectPolicySettingsAndroid: redirectPolicySettingsAndroid,
            redirectPolicySettingsIOS: redirectPolicySettingsIOS
        }

        Xsolla.init(settings);
    }
}
