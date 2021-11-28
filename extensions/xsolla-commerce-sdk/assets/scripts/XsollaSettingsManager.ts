// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Enum, sys, VERSION } from 'cc';
import { XsollaAuthenticationType, XsollaSettings, Xsolla, XsollaPublishingPlatform } from './Xsolla';
const { ccclass, property, disallowMultiple, type  } = _decorator;
 
@ccclass('XsollaSettingsManager')
@disallowMultiple(true)
export class XsollaSettingsManager extends Component {

    @property({
        displayName: 'Login ID',
        tooltip: 'Login ID in the UUID format from your Publisher Account (required)'
    })
    loginId: string = '026201e3-7e40-11ea-a85b-42010aa80004';

    @property({
        displayName: 'Project ID',
        tooltip: 'Project ID from your Publisher Account (required)'
    })
    projectId: string = '77640';

    @property ({
        displayName: 'Authentication Type',
        tooltip: 'If enabled, OAuth 2.0 protocol will be used in order to authorize the user',
    })
    @type(Enum(XsollaAuthenticationType))
    authType: XsollaAuthenticationType = XsollaAuthenticationType.Oauth2;

    @property ({
        displayName: 'Client ID',
        tooltip: 'Client ID from your Publisher Account',
        visible: function(): boolean {
            return this.authType == XsollaAuthenticationType.Oauth2;
        }        
    })
    clientId: number = 57;

    @property ({
        displayName: 'Enable Sandbox',
        tooltip: 'Enable to test the payment process: sandbox-secure.xsolla.com will be used instead of secure.xsolla.com.'
    })
    enableSandbox: boolean = true;

    @property ({
        displayName: 'Use cross platform account linking',
        tooltip: 'If enabled, SDK will imitate platform-specific requests so you can try account linking from different platforms.'
    })
    useCrossPlatformAccountLinking: boolean = false;

    @property ({
        displayName: 'Platform',
        tooltip: 'Target platform for cross-platform account linking. If using Xsolla Login, make sure that in the Login settings the same platform is chosen.',
        visible: function(): boolean {
            return this.useCrossPlatformAccountLinking;
        }
    })
    platform: XsollaPublishingPlatform;

    start() {
        var settings: XsollaSettings = {
            loginId: this.loginId,
            projectId: this.projectId,
            authType: this.authType,
            clientId: this.clientId,
            enableSandbox: this.enableSandbox,
            useCrossPlatformAccountLinking: this.useCrossPlatformAccountLinking,
            platform: this.platform
        }

        Xsolla.init(settings);
    }
}
