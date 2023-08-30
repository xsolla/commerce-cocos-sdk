import { _decorator, assetManager, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { StoreItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';

const { ccclass, property } = _decorator;

export namespace displayCatalogItem {

    @ccclass('StoreItemComponent')
    export class StoreItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        itemNameLabel: Label;

        @property(Label)
        itemDescriptionLabel: Label;

        @property(Label)
        priceLabel: Label;

        private _data: StoreItem;

        init(data: StoreItem) {
            
            this._data = data;

            this.itemNameLabel.string = data.name;
            this.itemDescriptionLabel.string = data.description;
            
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