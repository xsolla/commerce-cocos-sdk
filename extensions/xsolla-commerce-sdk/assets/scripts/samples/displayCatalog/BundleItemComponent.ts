import { _decorator, assetManager, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { StoreBundle } from '../../api/XsollaCatalog';
const { ccclass, property } = _decorator;

export namespace displayCatalogItem {

    @ccclass('BundleItemComponent')
    export class BundleItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        bundleNameLabel: Label;

        @property(Label)
        bundleDescriptionLabel: Label;

        @property(Label)
        priceLabel: Label;

        @property(Label)
        contentDescriptionLabel: Label;

        init(data: StoreBundle) {
            
            this.bundleNameLabel.string = data.name;
            this.bundleDescriptionLabel.string = data.description;
            
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

            this.contentDescriptionLabel.string = 'This bundle includes '+ data.content.length + ' items: ';
            var bandles = data.content.map(bundle => bundle.name).join(', ');
            this.contentDescriptionLabel.string += bandles;
        }
    }
}