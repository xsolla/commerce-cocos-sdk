import { _decorator, Component, Node, Button, EditBox, EventHandler, sys, System } from 'cc';
import { XsollaLogin } from 'db://xsolla-commerce-sdk/scripts/api/XsollaLogin';
const { ccclass, property } = _decorator;
 
@ccclass('LoginManager')
export class LoginManager extends Component {

    @property(EditBox)
    usernameEditBox: EditBox;

    @property(EditBox)
    passwordEditBox: EditBox;

    @property(Button)
    logInButton: Button;

    start () {        
        this.logInButton.node.on('click', this.onLoginClicked, this);
    }

    onDestroy () {
        this.logInButton.node.off('click', this.onLoginClicked, this);
    }

    onLoginClicked() {
        XsollaLogin.authByUsernameAndPassword(this.usernameEditBox.string, this.passwordEditBox.string, false, 'xsollatest', res => {
            console.log(res)
        }, err => {
            console.log(err)
        })
    }
}
