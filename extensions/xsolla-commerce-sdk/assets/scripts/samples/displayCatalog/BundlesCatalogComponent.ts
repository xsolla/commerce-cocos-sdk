
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { displayCatalogItem } from './BundleItemComponent';
import { XsollaCatalog } from '../../api/XsollaCatalog';
const { ccclass, property } = _decorator;

namespace displayCatalog {

    @ccclass('BundlesCatalogComponent')
    export class BundlesCatalogComponent extends Component {
        
        @property(ScrollView)
        itemsScrollView: ScrollView;

        @property(Prefab)
        bundleItemPrefab: Prefab;

        start() {
            XsollaCatalog.getBundleList(null, null, [], itemsData => {
            for (let i = 0; i < itemsData.items.length; ++i) {
                    let bundleItem = instantiate(this.bundleItemPrefab);
                    this.itemsScrollView.content.addChild(bundleItem);
                    bundleItem.getComponent(displayCatalogItem.BundleItemComponent).init(itemsData.items[i]);
                }
            });
        }
    }
}