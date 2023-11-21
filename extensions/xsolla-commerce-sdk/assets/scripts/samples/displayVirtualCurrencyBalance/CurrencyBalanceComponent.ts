
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { displayVirtualCurrencyBalanceItem } from './CurrencyBalanceItemComponent';
import { XsollaAuth } from '../../api/XsollaAuth';
import { XsollaInventory } from '../../api/XsollaInventory';
const { ccclass, property } = _decorator;

namespace displayVirtualCurrencyBalance {

    @ccclass('CurrencyBalanceComponent')
    export class CurrencyBalanceComponent extends Component {
        
        @property(ScrollView)
        itemsList: ScrollView;

        @property(Prefab)
        currencyBalanceItemPrefab: Prefab;

        start() {
            XsollaAuth.authByUsernameAndPassword('xsolla', 'xsolla', false, token => {
                XsollaInventory.getVirtualCurrencyBalance(token.access_token, null, itemsData => {
                    for (let i = 0; i < itemsData.items.length; ++i) {
                            let currencyBalanceItem = instantiate(this.currencyBalanceItemPrefab);
                            this.itemsList.content.addChild(currencyBalanceItem);
                            currencyBalanceItem.getComponent(displayVirtualCurrencyBalanceItem.CurrencyBalanceItemComponent).init(itemsData.items[i]);
                        }
                    });
            });
            
        }
    }
}
