// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Enum} from 'cc';
import { AuthenticationType, XsollaSettings, Xsolla, PaymentUiTheme, PaymentUiSize, PaymentUiVersion, PaymentRedirectCondition, PaymentRedirectStatusManual } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
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
        displayName: 'Authentication Type',
        tooltip: 'If enabled, OAuth 2.0 protocol will be used in order to authorize the user',
        group: 'General'
    })
    @type(Enum(AuthenticationType))
    authType: AuthenticationType = AuthenticationType.Oauth2;

    @property ({
        displayName: 'Client ID',
        tooltip: 'Client ID from your Publisher Account',
        group: 'General',
        visible: function(): boolean {
            return this.authType == AuthenticationType.Oauth2;
        }
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
        group: 'Paystation UI'
    })
    @type(Enum(PaymentUiTheme))
    paymentInterfaceTheme: PaymentUiTheme = PaymentUiTheme.ps4_default_dark;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: 'Paystation UI'
    })
    @type(Enum(PaymentUiSize))
    paymentInterfaceSize: PaymentUiSize = PaymentUiSize.medium;

    @property ({
        displayName: 'Payment UI Size',
        tooltip: 'User interface size for the payment interface.',
        group: 'Paystation UI'
    })
    @type(Enum(PaymentUiVersion))
    paymentInterfaceVersion: PaymentUiVersion = PaymentUiVersion.desktop;

    @property ({
        displayName: 'Override Redirect Policy',
        tooltip: 'Enable to override default redirect policy for payments.',
        group: 'Redirect Policy'
    })
    overrideRedirectPolicy: boolean = false;

    @property ({
        displayName: 'Return Url',
        tooltip: 'Page to redirect user to after the payment.',
        group: 'Redirect Policy'
    })
    returnUrl: string = '';

    @property ({
        displayName: 'Redirect Condition',
        tooltip: 'Payment status that triggers user redirect to the return URL.',
        group: 'Redirect Policy'
    })
    @type(Enum(PaymentRedirectCondition))
    redirectCondition: PaymentRedirectCondition = PaymentRedirectCondition.none;

    @property ({
        displayName: 'Redirect Delay',
        tooltip: 'Delay after which the user will be automatically redirected to the return URL.',
        group: 'Redirect Policy'
    })
    redirectDelay: number = 0;

    @property ({
        displayName: 'Redirect Status Manual',
        tooltip: 'Payment status triggering the display of a button clicking which redirects the user to the return URL.',
        group: 'Redirect Policy'
    })
    @type(Enum(PaymentRedirectStatusManual))
    redirectStatusManual: PaymentRedirectStatusManual = PaymentRedirectStatusManual.none;

    @property ({
        displayName: 'Redirect Button Caption',
        tooltip: 'Redirect button caption.',
        group: 'Redirect Policy'
    })
    redirectButtonCaption: string = '';

    start() {
        var settings: XsollaSettings = {
            loginId: this.loginId,
            projectId: this.projectId,
            authType: this.authType,
            clientId: this.clientId,
            enableSandbox: this.enableSandbox,
            paymentInterfaceTheme: this.paymentInterfaceTheme,
            paymentInterfaceSize: this.paymentInterfaceSize,
            paymentInterfaceVersion: this.paymentInterfaceVersion,
            overrideRedirectPolicy: this.overrideRedirectPolicy,
            returnUrl: this.returnUrl,
            redirectCondition: this.redirectCondition,
            redirectDelay: this.redirectDelay,
            redirectStatusManual: this.redirectStatusManual,
            redirectButtonCaption: this.redirectButtonCaption
        }

        Xsolla.init(settings);
    }
}
