
import { _decorator, Button, Component, EditBox, Toggle } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization {

    @ccclass('LoginComponent')
    export class LoginComponent extends Component {
        
        @property(EditBox)
        usernameEditBox: EditBox;

        @property(EditBox)
        passwordEditBox: EditBox;

        @property(Toggle)
        remeberMeToggle: Toggle;

        @property(Button)
        loginButton: Button;

        start() {
            this.loginButton.node.on(Button.EventType.CLICK, this.onLoginClicked, this);
        }

        onLoginClicked() {
            XsollaAuth.authByUsernameAndPassword(this.usernameEditBox.string, this.passwordEditBox.string, this.remeberMeToggle.isChecked, token => {
                console.log('Successful login. Token - ${token.access_token}');
            }, err => {
                console.log(err);
            });
        }
    }
}