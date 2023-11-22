import { _decorator, assetManager, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { VirtualCurrencyPackage } from '../../api/XsollaCatalog';
const { ccclass, property } = _decorator;

export namespace displayCatalogItem {

    @ccclass('CurrencyPackageItemComponent')
    export class CurrencyPackageItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        currencyNameLabel: Label;

        @property(Label)
        currencyDescriptionLabel: Label;

        @property(Label)
        priceLabel: Label;

        init(data: VirtualCurrencyPackage) {
            
            this.currencyNameLabel.string = data.name;
            this.currencyDescriptionLabel.string = data.description;
            
            if (data.virtual_prices.length > 0) {
                this.priceLabel.string = data.virtual_prices[0].amount.toString() + ' ' + data.virtual_prices[0].name;
            } else {
                this.priceLabel.string = parseFloat(data.price.amount) + ' ' + data.price.currency;
            }

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