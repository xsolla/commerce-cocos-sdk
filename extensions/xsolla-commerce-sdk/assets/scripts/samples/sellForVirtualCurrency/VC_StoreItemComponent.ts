import { _decorator, assetManager, Button, Component, ImageAsset, Label, Sprite, SpriteFrame, Texture2D } from 'cc';
import { StoreItem, XsollaCatalog } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { TokenStorage } from 'db://xsolla-commerce-sdk/scripts/common/TokenStorage';
import { OrderTracker } from 'db://xsolla-commerce-sdk/scripts/common/OrderTracker';
const { ccclass, property } = _decorator;

export namespace sellForVirtualCurrencyItem {

    @ccclass('VC_StoreItemComponent')
    export class VC_StoreItemComponent extends Component {

        @property(Sprite)
        iconSprite: Sprite;

        @property(Label)
        itemNameLabel: Label;

        @property(Label)
        itemDescriptionLabel: Label;

        @property(Label)
        priceLabel: Label;

        @property(Button)
        buyButton: Button;

        private _data: StoreItem;

        start() {
            this.buyButton.node.on(Button.EventType.CLICK, this.onBuyClicked, this);
        }

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

        onBuyClicked() {
            XsollaCatalog.purchaseItemForVirtualCurrency(TokenStorage.getToken().access_token, this._data.sku, this._data.virtual_prices[0].sku, orderId => {
                OrderTracker.checkPendingOrder(TokenStorage.getToken().access_token, orderId, () => {
                    console.log('success purchase!');
                }, error => {
                    console.log(`Order checking failed - Status code: ${error.status}, Error code: ${error.code}, Error message: ${error.description}`);
                });
            }, error => {
                console.log(error.description);
            });
        }
    }
}