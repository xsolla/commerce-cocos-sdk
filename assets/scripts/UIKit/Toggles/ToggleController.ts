// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Toggle, Label, Color } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('ToggleController')
export class ToggleController extends Component {

    @property(Label)
    ToggleText: Label;

    @property(Color)
    NormalTextColor: Color = new Color(255, 255, 255, 200);

    @property(Color)
    HoverTextColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    CheckedTextColor: Color = new Color(255, 255, 255, 255);

    private _toggle: Toggle = null;

    private _isMouseOver: boolean = false;

    start () {
        this._toggle = this.getComponent(Toggle);
        this.node.on(Node.EventType.MOUSE_ENTER, () => {
            this._isMouseOver = true;
            if (!this._toggle.isChecked) {
                this.ToggleText.color = this.HoverTextColor;
            }            
        });
        this.node.on(Node.EventType.MOUSE_LEAVE, () => {
            this._isMouseOver = false;
            if (!this._toggle.isChecked) {
                this.ToggleText.color = this.NormalTextColor;
            } 
        });

        // TODO: implement proper logic for highlighting toggle when mouse hover
    }
}
