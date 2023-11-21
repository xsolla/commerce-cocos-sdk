
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { sellForVirtualCurrencyItem } from './VC_StoreItemComponent';
import { XsollaAuth } from '../../api/XsollaAuth';
import { TokenStorage } from '../../common/TokenStorage';
import { XsollaCatalog } from '../../api/XsollaCatalog';
const { ccclass, property } = _decorator;

namespace sellForVirtualCurrency {

    @ccclass('VC_ItemsCatalogComponent')
    export class VC_ItemsCatalogComponent extends Component {
        
        @property(ScrollView)
        itemsScrollView: ScrollView;

        @property(Prefab)
        storeItemPrefab: Prefab;

        start() {
            XsollaAuth.authByUsernameAndPassword('xsolla', 'xsolla', false, token => {
                TokenStorage.saveToken(token, false);
                XsollaCatalog.getCatalog(null, null, [], itemsData => {
                    for (let i = 0; i < itemsData.items.length; ++i) {
                            let storeItem = instantiate(this.storeItemPrefab);
                            this.itemsScrollView.content.addChild(storeItem);
                            storeItem.getComponent(sellForVirtualCurrencyItem.VC_StoreItemComponent).init(itemsData.items[i]);
                        }
                    });
            });
        }
    }
}