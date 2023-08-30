
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = VCItemsCatalogComponent
 * DateTime = Wed Aug 30 2023 09:27:48 GMT+0300 (Москва, стандартное время)
 * Author = lelka
 * FileBasename = VC_ItemsCatalogComponent.ts
 * FileBasenameNoExtension = VC_ItemsCatalogComponent
 * URL = db://xsolla-commerce-sdk/scripts/samples/sellForRealMoney/VC_ItemsCatalogComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('VCItemsCatalogComponent')
export class VCItemsCatalogComponent extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start () {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
