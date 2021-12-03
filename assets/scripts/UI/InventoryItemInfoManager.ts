
import { _decorator, Component, Node, Sprite, Label, Button, Color, ImageAsset, assetManager, SpriteFrame, Texture2D } from 'cc';
import { InventoryItem, XsollaInventory } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { StoreItem } from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { TokenStorage } from '../Common/TokenStorage';
import { InventoryManager } from './InventoryManager';
import { InventoryItemComponent } from './Misc/InventoryItemComponent';
import { UIManager } from './UIManager';
import { CurrencyFormatter } from './Utils/CurrencyFormatter';
import { PurchaseUtil } from './Utils/PurchaseUtil';
const { ccclass, property } = _decorator;
 
@ccclass('InventoryItemInfoManager')
export class InventoryItemInfoManager extends Component {

    @property(Sprite)
    icon: Sprite;

    @property(Label)
    itemName: Label;

    @property(Node)
    expiredContainer: Node;

    @property(Label)
    expiredLabel: Label;

    @property(Label)
    description: Label;

    @property(Node)
    counterContainer: Node;

    @property(Label)
    quantityLabel: Label;

    @property(Label)
    typesLabel: Label;

    @property(Node)
    buyAgainContainer: Node;

    @property(Node)
    consumeContainer: Node;

    @property(Node)
    purchasedContainer: Node;

    @property(Sprite)
    currency: Sprite;

    @property(Label)
    price: Label;

    @property(Label)
    priceWithoutDiscount: Label;

    @property(Button)
    consumeBtn: Button;

    @property(Button)
    buyAgainBtn: Button;

    @property(Button)
    minusBtn: Button;

    @property(Label)
    counterLabel: Label;

    @property(Button)
    plusBtn: Button;

    @property(Label)
    counter: Label;

    @property(Button)
    closeBtn: Button;

    private _parent: InventoryManager;

    private _data: InventoryItem;

    private _storeItem: StoreItem;

    private _redColor: Color = new Color(255, 0, 91);
    private _whiteColor: Color = new Color(255, 255, 255);

    private _counter: number;

    onEnable() {
        this.addListeners();
    }

    onDisable() {
        this.removeListeners();
    }

    addListeners () {
        this.closeBtn.node.on(Button.EventType.CLICK, this.closeClicked, this);
        this.consumeBtn.node.on(Button.EventType.CLICK, this.consumeClicked, this);
        this.buyAgainBtn.node.on(Button.EventType.CLICK, this.buyAgainClicked, this);
        this.minusBtn.node.on(Button.EventType.CLICK, this.minusClicked, this);
        this.plusBtn.node.on(Button.EventType.CLICK, this.plusClicked, this);
    }

    removeListeners () {
        this.closeBtn.node.on(Button.EventType.CLICK, this.closeClicked, this);
        this.consumeBtn.node.off(Button.EventType.CLICK, this.consumeClicked, this);
        this.buyAgainBtn.node.off(Button.EventType.CLICK, this.buyAgainClicked, this);
        this.minusBtn.node.off(Button.EventType.CLICK, this.minusClicked, this);
        this.plusBtn.node.off(Button.EventType.CLICK, this.plusClicked, this);
    }

    init(data:InventoryItem, storeItem:StoreItem, expires_at: number, parent:InventoryManager) {
        this._data = data;
        this._parent = parent;
        this._storeItem = storeItem;
        this.updateCounter(1);

        assetManager.loadRemote<ImageAsset>(data.image_url, (err, imageAsset) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            this.icon.spriteFrame = spriteFrame;
        });

        this.itemName.string = data.name;
        this.description.string = data.description;

        let utcNow = InventoryItemComponent.convertDateToUTC(new Date());
        let isExpired = (expires_at * 1000) < utcNow.getTime();
        let isNonRenewingSubscription = data.virtual_item_type == 'non_renewing_subscription';
        let isConsumable = data.virtual_item_type == 'consumable';
        let isNonConsumable = data.virtual_item_type == 'non_consumable';
        this.counterContainer.active = !isNonRenewingSubscription;
        this.quantityLabel.string = data.quantity.toString();

        this.expiredContainer.active = isNonRenewingSubscription;
        if(isNonRenewingSubscription) {
            this.expiredLabel.color = isExpired ? this._redColor : this._whiteColor;
            this.expiredLabel.string = InventoryItemComponent.expireText(expires_at);
        }
        let types: Array<string> = [];
        data.groups.forEach(x => types.push(x.name));
        this.typesLabel.string = types.join(',');

        this.buyAgainContainer.active = isNonRenewingSubscription && storeItem != null;
        if(storeItem != null) {
            let isVirtualCurrency = storeItem.virtual_prices.length > 0;
            this.currency.node.active = isVirtualCurrency;
            let price;
            let priceWithoutDiscount;
            if(isVirtualCurrency) {
                price =  storeItem.virtual_prices[0].amount.toString();
                priceWithoutDiscount =  storeItem.virtual_prices[0].amount_without_discount.toString();
            } else {
                price = CurrencyFormatter.formatPrice(parseFloat(storeItem.price.amount), storeItem.price.currency);
                priceWithoutDiscount = CurrencyFormatter.formatPrice(parseFloat(storeItem.price.amount_without_discount), storeItem.price.currency);
            }
            this.price.string = price;
            this.priceWithoutDiscount.string = priceWithoutDiscount;
            this.priceWithoutDiscount.node.getParent().active = price != priceWithoutDiscount;
        }
        this.consumeContainer.active = isConsumable;
    }

    closeClicked() {
        this._parent.openAllItemsScreen();
    }

    consumeClicked() {
        XsollaInventory.consumeInventoryItem(TokenStorage.getToken().access_token, this._data.sku, this._counter, this._data.instance_id, null, () => {
            this.closeClicked();
            UIManager.instance.openMessageScreen(`You have consumed ${this._data.name} x ${this._counter}!`);
            this._parent.init();
        }, error => {
            console.log(error);
            UIManager.instance.openErrorScreen(error.description);
        });
    }

    buyAgainClicked() {
        PurchaseUtil.buyItem(this._storeItem, () => {
            this.closeClicked();
            this._parent.init();
        });
        
    }

    minusClicked() {
        this.updateCounter(this._counter - 1);
    }

    plusClicked() {
        this.updateCounter(this._counter + 1);
    }

    updateCounter(newValue: number) {
        this._counter = newValue;
        this.counterLabel.string = this._counter.toString();
        this.minusBtn.enabled = this._counter > 1;
        this.plusBtn.enabled = this._counter < this._data.quantity;
    }
}
