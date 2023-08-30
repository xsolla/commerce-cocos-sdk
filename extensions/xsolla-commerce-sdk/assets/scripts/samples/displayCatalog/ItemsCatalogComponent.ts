
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { displayCatalogItem } from './StoreItemComponent';
import { XsollaCatalog } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
const { ccclass, property } = _decorator;

 namespace displayCatalog {

    @ccclass('ItemsCatalogComponent')
    export class ItemsCatalogComponent extends Component {
        
        @property(ScrollView)
        itemsScrollView: ScrollView;

        @property(Prefab)
        storeItemPrefab: Prefab;

        start() {
            XsollaCatalog.getCatalog(null, null, [], itemsData => {
                for (let i = 0; i < itemsData.items.length; ++i) {
                    let storeItem = instantiate(this.storeItemPrefab);
                    this.itemsScrollView.content.addChild(storeItem);
                    storeItem.getComponent(displayCatalogItem.StoreItemComponent).init(itemsData.items[i]);
                }
            });
        }
    }
}