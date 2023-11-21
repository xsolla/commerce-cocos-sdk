
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { sellForRealMoneyItem } from './RC_StoreItemComponent';
import { XsollaAuth } from '../../api/XsollaAuth';
import { TokenStorage } from '../../common/TokenStorage';
import { XsollaCatalog } from '../../api/XsollaCatalog';
const { ccclass, property } = _decorator;

namespace sellForRealMoney {

    @ccclass('RC_ItemsCatalogComponent')
    export class RC_ItemsCatalogComponent extends Component {
        
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
                            storeItem.getComponent(sellForRealMoneyItem.RC_StoreItemComponent).init(itemsData.items[i]);
                        }
                    });
            });
        }
    }
}