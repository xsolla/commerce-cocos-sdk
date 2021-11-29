// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Label, Sprite, Color } from 'cc';
import { StoreManager } from '../StoreManager';
const { ccclass, property } = _decorator;
 
@ccclass('GroupsItemComponent')
export class GroupsItemComponent extends Component {

    @property(Label)
    groupNameLabel: Label;

    @property(Sprite)
    line: Sprite;

    groupId: string;

    isSelected: boolean;

    _parent: StoreManager;

    _redColor: Color = new Color(255, 0, 91);
    _whiteColor: Color = new Color(255, 255, 255);

    init(groupId: string, groupName: string, parent: StoreManager) {
        this._parent = parent;
        this.groupNameLabel.string = groupName.toUpperCase();
        this.groupId = groupId;
    }

    onClicked() {
        if(this.isSelected) {
            return;
        }
        this._parent.groupSelected(this.groupId);
    }

    onSelected(isSelected: boolean) {
        this.isSelected = isSelected;
        this.groupNameLabel.color = this.isSelected ? this._redColor : this._whiteColor;
        this.line.node.active = this.isSelected;
    }
}