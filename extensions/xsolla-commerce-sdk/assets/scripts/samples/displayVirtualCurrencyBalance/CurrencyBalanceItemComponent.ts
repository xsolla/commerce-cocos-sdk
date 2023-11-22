import { _decorator, assetManager, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { VirtualCurrencyBalance } from '../../api/XsollaInventory';
const { ccclass, property } = _decorator;

export namespace displayVirtualCurrencyBalanceItem {

    @ccclass('CurrencyBalanceItemComponent')
    export class CurrencyBalanceItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        currencyNameLabel: Label;

        @property(Label)
        quantityLabel: Label;

        init(data: VirtualCurrencyBalance) {
            
            this.currencyNameLabel.string = data.name;
            this.quantityLabel.string = data.amount.toString();

            assetManager.loadRemote<ImageAsset>(data.image_url, (err, imageAsset) => {
                if(err == null) {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                this.iconSprite.spriteFrame = spriteFrame;
                } else {
                    console.log(`Cant load image with url ${data.image_url}`);
                }
            });
        }
    }
}