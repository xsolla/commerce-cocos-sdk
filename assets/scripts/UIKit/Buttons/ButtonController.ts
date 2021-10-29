// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Button, Color, color } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ButtonController')
export class ButtonController extends Component {

    @property(Label)
    ButtonText: Label;

    @property(Color)
    NormalTextColor: Color = new Color(255, 255, 255, 200);

    @property(Color)
    HoverTextColor: Color = new Color(255, 255, 255, 255);

    start () {
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this.ButtonText.color = this.HoverTextColor;
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this.ButtonText.color = this.NormalTextColor;
        });
    }
}