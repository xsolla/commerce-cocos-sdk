// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Color, Sprite } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

@ccclass('ButtonController')
@executeInEditMode
export class ButtonController extends Component {

    @property(Label)
    ButtonText: Label;

    @property({
        displayName: 'Show Icon'
    })
    showIcon: boolean = false;

    @property({
        type:Sprite,
        visible: function(): boolean {
            return this.showIcon;
        }
    })
    ButtonIcon: Sprite;

    @property(Color)
    NormalTextColor: Color = new Color(255, 255, 255, 200);

    @property(Color)
    HoverTextColor: Color = new Color(255, 255, 255, 255);

    update () {
        if(this.ButtonIcon != null && this.ButtonIcon.node != null)
        {
            this.ButtonIcon.node.active = this.showIcon;
        }
    }

    start () {
        this.ButtonText.color = this.NormalTextColor;
        if(this.ButtonIcon != null)
        {
            this.ButtonIcon.color = this.NormalTextColor;
        }
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.ButtonText.color = this.HoverTextColor;
            if(this.ButtonIcon != null)
            {
                this.ButtonIcon.color= this.HoverTextColor;
            }
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.ButtonText.color = this.NormalTextColor;
            if(this.ButtonIcon != null)
            {
                this.ButtonIcon.color = this.NormalTextColor;
            }
        });
    }
}