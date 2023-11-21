import { _decorator, Button, Component } from 'cc';
import { Token, XsollaAuth } from '../../api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization {
 
    @ccclass('SocialLoginComponent')
    export class SocialLoginComponent extends Component {
        
        @property(Button)
        socialLoginButton: Button;

        start() {
            this.socialLoginButton.node.on(Button.EventType.CLICK, this.onSocialLoginClicked, this);
        }

        onSocialLoginClicked() {
            XsollaAuth.authSocial('facebook', (token: Token) => {
                console.log(`Successful social authentication. Token - ${token.access_token}`);
            }, () => {
                console.log('Social auth was canceled');
            }, (error:string) => {
                console.log(error);
            });
        }
    }
}