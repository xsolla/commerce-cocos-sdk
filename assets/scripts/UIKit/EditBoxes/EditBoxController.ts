// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, Label, Button, Color, color, EditBox, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('EditBoxController')
export class EditBoxController extends Component {

    @property(Color)
    NormalTextColor: Color = new Color(255, 255, 255, 200);

    @property(Color)
    HoverTextColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    ActiveText: Color = new Color(255, 255, 255, 255);

    @property(SpriteFrame)
    NormalBackground: SpriteFrame;

    @property(SpriteFrame)
    HoverBackground: SpriteFrame;

    @property(SpriteFrame)
    ActiveBackground: SpriteFrame;

    private _editBox: EditBox = null;

    private _isActive: boolean = false;
    private _isMouseOver: boolean = false;

    start () {
        this._editBox = this.getComponent(EditBox);
        if (this._editBox != null) {
            this._editBox.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditingDidBegin, this);
            this._editBox.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditingDidEnd, this);
            this._editBox.node.on(EditBox.EventType.EDITING_RETURN, this.onEditingReturn, this);

            this.node.on(Node.EventType.MOUSE_ENTER, () => {
                this._isMouseOver = true;
                if (!this._isActive) {
                    this._editBox.textLabel.color = this.HoverTextColor;
                    this._editBox.backgroundImage = this.HoverBackground;
                }            
            });
            this.node.on(Node.EventType.MOUSE_LEAVE, () => {
                this._isMouseOver = false;
                if (!this._isActive) {
                    this._editBox.textLabel.color = this.NormalTextColor;
                    this._editBox.backgroundImage = this.NormalBackground;
                } 
            });
        }
    }

    onEditingDidBegin() {
        this._isActive = true;
        this._editBox.textLabel.color = this.ActiveText;
        this._editBox.backgroundImage = this.ActiveBackground;

        if (this._editBox.inputFlag == EditBox.InputFlag.PASSWORD){
            this._editBox.string = "";
        }
    }

    onEditingDidEnd() {
        this._isActive = false;
        if(this._isMouseOver) {
            this._editBox.textLabel.color = this.HoverTextColor;
            this._editBox.backgroundImage = this.HoverBackground;
        }
        else {
            this._editBox.textLabel.color = this.NormalTextColor;
            this._editBox.backgroundImage = this.NormalBackground;
        }
    }

    onEditingReturn() {
        this._isActive = false;
        if(this._isMouseOver) {
            this._editBox.textLabel.color = this.HoverTextColor;
            this._editBox.backgroundImage = this.HoverBackground;
        }
        else {
            this._editBox.textLabel.color = this.NormalTextColor;
            this._editBox.backgroundImage = this.NormalBackground;
        }
    }
}
