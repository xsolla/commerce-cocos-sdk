import { _decorator, Button, Component, director } from 'cc';
import { NativeUtil } from 'db://xsolla-commerce-sdk/scripts/common/NativeUtil';
import { Events } from 'db://xsolla-commerce-sdk/scripts/core/Events';
import { Token } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization {
 
    @ccclass('SocialLoginComponent')
    export class SocialLoginComponent extends Component {
        
        @property(Button)
        socialLoginButton: Button;

        start() {
            this.socialLoginButton.node.on(Button.EventType.CLICK, this.onSocialLoginClicked, this);

            director.getScene().on(Events.SOCIAL_AUTH_SUCCESS, this.handleSuccessfulSocialAuth, this );
            director.getScene().on(Events.SOCIAL_AUTH_ERROR, this.handleErrorSocialAuth, this );
            director.getScene().on(Events.SOCIAL_AUTH_CANCELED, this.handleCancelSocialAuth, this );
        }

        onSocialLoginClicked() {
            NativeUtil.authSocial('facebook');
        }

        handleSuccessfulSocialAuth(token:Token) {
            console.log(`Successful social authentication. Token - ${token.access_token}`);
        }

        handleCancelSocialAuth() {
            console.log('Social auth was canceled');
        }

        handleErrorSocialAuth(error:string) {
            console.log(error);
        }
    }
}