import { _decorator, assetManager, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { InventoryItem } from '../../api/XsollaInventory';
const { ccclass, property } = _decorator;

export namespace displayItemsInInventoryItem {

    @ccclass('InventoryItemComponent')
    export class InventoryItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        itemNameLabel: Label;

        @property(Label)
        itemDescriptionLabel: Label;

        @property(Label)
        quantityLabel: Label;

        init(data: InventoryItem) {
            
            this.itemNameLabel.string = data.name;
            this.itemDescriptionLabel.string = data.description;
            this.quantityLabel.string = data.quantity.toString();

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