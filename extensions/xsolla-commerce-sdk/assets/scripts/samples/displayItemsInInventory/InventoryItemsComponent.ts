
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { displayItemsInInventoryItem } from './InventoryItemComponent';
import { XsollaAuth } from '../../api/XsollaAuth';
import { XsollaInventory } from '../../api/XsollaInventory';
const { ccclass, property } = _decorator;

namespace displayItemsInInventory {

    @ccclass('InventoryItemsComponent')
    export class InventoryItemsComponent extends Component {
        
        @property(ScrollView)
        itemsScrollView: ScrollView;

        @property(Prefab)
        inventoryItemPrefab: Prefab;

        start() {
            XsollaAuth.authByUsernameAndPassword('xsolla', 'xsolla', false, token => {
                XsollaInventory.getInventory(token.access_token, null, itemsData => {
                    for (let i = 0; i < itemsData.items.length; ++i) {
                            let inventoryItem = instantiate(this.inventoryItemPrefab);
                            this.itemsScrollView.content.addChild(inventoryItem);
                            inventoryItem.getComponent(displayItemsInInventoryItem.InventoryItemComponent).init(itemsData.items[i]);
                        }
                    });
            });
            
        }
    }
}