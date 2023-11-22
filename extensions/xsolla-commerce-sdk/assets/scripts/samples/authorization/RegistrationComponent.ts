
import { _decorator, Button, Component, EditBox } from 'cc';
import { XsollaAuth } from '../../api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization {
 
    @ccclass('RegistrationComponent')
    export class RegistrationComponent extends Component {
        
        @property(EditBox)
        usernameEditBox: EditBox;

        @property(EditBox)
        emailEditBox: EditBox;

        @property(EditBox)
        passwordEditBox: EditBox;

        @property(Button)
        signUpButton: Button;

        start() {
            this.signUpButton.node.on(Button.EventType.CLICK, this.onSignUpClicked, this);
        }

        onSignUpClicked() {
            XsollaAuth.registerNewUser(this.usernameEditBox.string, this.passwordEditBox.string, this.emailEditBox.string, 'xsollatest', null, null, token => {
                if(token != null) {
                    console.log(`Successful login. Token - ${token.access_token}`);
                }
                else {
                    console.log('Thank you! We have sent you a confirmation email');
                }
            }, err => {
                console.log(err);
            });
        }
    }
}