
import { _decorator, Button, Component, EditBox } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
const { ccclass, property } = _decorator;

namespace authorization { 

    @ccclass('ResendConfirmationEmailComponent')
    export class ResendConfirmationEmailComponent extends Component {
        
        @property(EditBox)
        usernameEditBox: EditBox;

        @property(Button)
        resendEmailButton: Button;

        start() {
            this.resendEmailButton.node.on(Button.EventType.CLICK, this.onResendEmailClicked, this);
        }

        onResendEmailClicked() {
            XsollaAuth.resendAccountConfirmationEmail(this.usernameEditBox.string, 'xsollatest', null, () => {
                console.log('A verification link has been successfully sent to your email');
            }, err => {
                console.log(err);
            });
        }
    }
}