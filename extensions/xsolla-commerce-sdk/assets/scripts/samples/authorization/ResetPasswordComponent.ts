
import { _decorator, Button, Component, EditBox } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization { 

    @ccclass('ResetPasswordComponent')
    export class ResetPasswordComponent extends Component {
        
        @property(EditBox)
        usernameEditBox: EditBox;

        @property(Button)
        resetPasswordButton: Button;

        start() {
            this.resetPasswordButton.node.on(Button.EventType.CLICK, this.onResetPasswordClicked, this);
        }

        onResetPasswordClicked() {
            XsollaAuth.resetPassword(this.usernameEditBox.string, null, () => {
                console.log('Follow the instructions we sent to your email');
            }, err => {
                console.log(err);
            });
        }
    }
}