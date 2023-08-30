import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { XsollaCatalog } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { displayCatalogItem } from './CurrencyPackageItemComponent';
const { ccclass, property } = _decorator;

namespace displayCatalog {

    @ccclass('CurrencyPackagesCatalogComponent')
    export class CurrencyPackagesCatalogComponent extends Component {
        
        @property(ScrollView)
        itemsScrollView: ScrollView;

        @property(Prefab)
        currencyPackageItemPrefab: Prefab;

        start() {
            XsollaCatalog.getVirtualCurrencyPackages(null, null, [], itemsData => {
            for (let i = 0; i < itemsData.items.length; ++i) {
                    let currencyPackageItem = instantiate(this.currencyPackageItemPrefab);
                    this.itemsScrollView.content.addChild(currencyPackageItem);
                    currencyPackageItem.getComponent(displayCatalogItem.CurrencyPackageItemComponent).init(itemsData.items[i]);
                }
            });
        }
    }
}