
import { _decorator, Component, instantiate, Prefab, ScrollView } from 'cc';
import { XsollaAuth } from 'db://xsolla-commerce-sdk/scripts/api/XsollaAuth';
import { XsollaInventory } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { displayVirtualCurrencyBalanceItem } from './CurrencyBalanceItemComponent';
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
