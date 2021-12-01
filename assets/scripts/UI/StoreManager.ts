// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, ScrollView, instantiate, Prefab, JsonAsset, sys } from 'cc';
import { StoreItem, XsollaStore} from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { XsollaUrlBuilder } from 'db://xsolla-commerce-sdk/scripts/core/XsollaUrlBuilder';
import { Xsolla } from 'db://xsolla-commerce-sdk/scripts/Xsolla';
import { InventoryItem, XsollaInventory } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { TokenStorage } from '../Common/TokenStorage';
import { ItemInfoManager } from './ItemInfoManager';
import { GroupsItemComponent } from './Misc/GroupsItemComponent';
import { StoreItemComponent } from './Misc/StoreItemComponent';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('StoreManager')
export class StoreManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

    @property(Node)
    allItemsScreen: Node;

    @property(Node)
    noItemsScreen: Node;

    @property(Node)
    itemInfoScreen: Node;

    @property(ScrollView)
    itemsList: ScrollView;

    @property(ScrollView)
    groupsList: ScrollView;

    @property(ItemInfoManager)
    itemInfoManager: ItemInfoManager;

    @property(Prefab)
    storeItemPrefab: Prefab;

    @property(Prefab)
    bundleItemPrefab: Prefab;

    @property(Prefab)
    groupItemPrefab: Prefab;

    @property(JsonAsset)
    currencyFormat:JsonAsset;

    storeItems: Array<StoreItem>;

    inventoryItems: Array<InventoryItem>;

    itemGroups: Map<string, string>;

    selectedGroup: string;

    bIsPaymentWidgetOpened:boolean = false;

    start() {
        
    }

    onEnable() {
        this.addListeners();
        XsollaStore.getVirtualItems('', '', [], storeItemsData => {
            XsollaStore.getBundles('', '', [], bundlesList => {
                XsollaInventory.getInventory(TokenStorage.getToken().access_token, StoreManager.getPublishingPlatformName(), inventoryData => {
                    for(let bundle of bundlesList.items) {
                        let castedBundle: any = bundle;
                        storeItemsData.items.push(castedBundle);
                    }
                    for(let bundle of bundlesList.items) {
                        for(let bundleGroup of bundle.groups) {
                            storeItemsData.groupIds.add(bundleGroup.external_id);
                        }
                    }
                    if(storeItemsData.items.length > 0) {
                        this.storeItems = storeItemsData.items.filter(x => !this.isStoreIteminBattlepassGroup(x));
                        this.inventoryItems = inventoryData.items;
                        this.populateGroupsList();
                        this.groupSelected('all_items');
                        this.itemsList.scrollToTop();
                        this.groupsList.scrollToTop();
                        this.openAllItemsScreen();
                    } else {
                        this.openNoItemsScreen();
                    }
                }, error => {
                    console.log(error);
                    this.uiManager.openErrorScreen(error.description);
                });
            }, error => {
                console.log(error);
                this.uiManager.openErrorScreen(error.description);
            }) 
        }, err => {
            console.log(err);
            this.uiManager.openErrorScreen(err.description);
        })
    }

    onDisable() {
        this.removeListeners();
        this.hideAllScreens();
    }

    addListeners () {

    }

    removeListeners () {

    }

    onBackClicked() {
        this.uiManager.openMainMenu(this.node);
    }

    openAllItemsScreen() {
        this.hideAllScreens();
        this.allItemsScreen.active = true;
    }

    openNoItemsScreen() {
        this.hideAllScreens();
        this.noItemsScreen.active = true;
    }

    openItemInfoScreen() {
        this.hideAllScreens();
        this.itemInfoScreen.active = true;
    }

    hideAllScreens() {
        this.allItemsScreen.active = false;
        this.noItemsScreen.active = false;
        this.itemInfoScreen.active = false;
    }

    populateItemsList() {
        this.itemsList.content.destroyAllChildren();
        for (let i = 0; i < this.storeItems.length; ++i) {
            let isAll = this.selectedGroup == 'all_items';
            let isUngrouped =  this.selectedGroup == 'ungrouped' && this.storeItems[i].groups.length == 0;
            let found = this.storeItems[i].groups.find(x => x.external_id == this.selectedGroup);
            if(isAll || isUngrouped || found) {
                let storeItem = instantiate(this.storeItemPrefab);
                this.itemsList.content.addChild(storeItem);
                let itemData = this.storeItems[i];
                let storeItemComponent = storeItem.getComponent(StoreItemComponent);
                let isItemInInventory = this.inventoryItems.find(x => x.sku == this.storeItems[i].sku) != null;
                storeItemComponent.init(itemData, this, isItemInInventory);
            }
        }
    }

    populateGroupsList() {
        this.groupsList.content.destroyAllChildren();
        this.itemGroups = new Map<string, string>();
        this.itemGroups.set('all_items', 'all');
        for(let i = 0; i < this.storeItems.length; ++i) {
            if(this.storeItems[i].groups.length > 0) {
                for(let group of this.storeItems[i].groups) {
                    this.itemGroups.set(group.external_id, group.name);
                }
            } else {
                this.itemGroups.set('Ungrouped', 'Ungrouped');
            }
        }

        for(let groupData of this.itemGroups) {
            let groupItem = instantiate(this.groupItemPrefab);
            this.groupsList.content.addChild(groupItem);
            let groupItemComponent = groupItem.getComponent(GroupsItemComponent);
            groupItemComponent.init(groupData[0], groupData[1], this);
        }
    }

    groupSelected(groupId: string) {
        this.selectedGroup = groupId;
        for(let groupItem of this.groupsList.content.children) {
            let groupItemComponent = groupItem.getComponent(GroupsItemComponent);
            if(groupItemComponent) {
                groupItemComponent.onSelected(groupItemComponent.groupId == this.selectedGroup);
            }
        }
        this.populateItemsList();
    }

    buyItem(item: StoreItem) {
        let isVirtual = item.virtual_prices.length > 0;
        if(isVirtual) {
            this.uiManager.openConfirmationScreen('Are you sure you want to purchase this item?', 'CONFIRM', () => {
                XsollaStore.buyItemWithVirtualCurrency(TokenStorage.getToken().access_token, item.sku, item.virtual_prices[0].sku, orderId => {
                    this.uiManager.openMessageScreen('Your order has been successfully processed!');
                }, error => {
                    console.log(error.description);
                    this.uiManager.openErrorScreen(error.description);
                })
            });
            return;
        }

        XsollaStore.fetchPaymentToken(TokenStorage.getToken().access_token, item.sku, 1, undefined, undefined, undefined, undefined, result => {
            if(sys.isMobile) {
                let url: XsollaUrlBuilder;
                if(Xsolla.settings.enableSandbox) {
                    url = new XsollaUrlBuilder('https://sandbox-secure.xsolla.com/paystation3');
                } else {
                    url = new XsollaUrlBuilder('https://secure.xsolla.com/paystation3');
                }
                url.addStringParam('access_token', result.token);
                this.shortPollingCheckOrder(result.orderId, result.token);
                sys.openURL(url.build());
            } else {
                this.bIsPaymentWidgetOpened = true;
                this.openPaystationWidget(result.orderId, result.token, Xsolla.settings.enableSandbox, () => {
                    this.shortPollingCheckOrder(result.orderId, result.token);
                }, () => {
                    this.bIsPaymentWidgetOpened = false;
                });
            }
        } );
    }

    showItemInfo(item: StoreItem) {
        let isBundle = item.bundle_type && item.bundle_type.length > 0;
        if(isBundle) {
            XsollaStore.getSpecifiedBundle(item.sku, bundle => {
                this.itemInfoManager.init(item, this, bundle.content);
                this.openItemInfoScreen();
            }, error => {
                console.log(error.description);
                this.uiManager.openErrorScreen(error.description);
            });
            return;
        }

        this.itemInfoManager.init(item, this);
        this.openItemInfoScreen();
    }

    shortPollingCheckOrder(orderId: number, token: string) {
        XsollaStore.checkOrder(token, orderId, result => {
            console.log('shortPollingCheckOrder ' + result.status);
            if(result.status == 'done') {
                if(!sys.isMobile) {
                    this.сlosePaystationWidget();
                }
                this.uiManager.openMessageScreen('success purchase!');
                return;
            }

            if(sys.isMobile || this.bIsPaymentWidgetOpened) {
                if(result.status == 'new' || result.status == 'paid') {
                    setTimeout(result => {
                        this.shortPollingCheckOrder(orderId, token);
                    }, 3000);
                }
            }
        })
    }

    openPaystationWidget(orderId: number, token: string, sandbox: boolean, onComplete?:() => void, onClosed?:() => void) {
        console.log('openPaystationWidget opened');
        var jsToken = token;
        var isSandbox = sandbox;
        var options = {
            access_token: jsToken,
            sandbox: isSandbox,
            lightbox: {
                width: '740px',
                height: '760px',
                spinner: 'round',
                spinnerColor: '#cccccc',
            }
        };
        
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://static.xsolla.com/embed/paystation/1.2.3/widget.min.js";
    
        let statusChangedFunction = function (event, data) {
            console.log('openPaystationWidget status changed');
            onComplete();
        };

        let closeWidgetFunction = function (event, data) {
            if (data === undefined) {
                s.removeEventListener('load', loadFunction, false);
                XPayStationWidget.off(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
                XPayStationWidget.off(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
                onClosed();
            }
            else {

            }
        };

        let loadFunction = function (e) {
            XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, statusChangedFunction);
            XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, closeWidgetFunction);
    
            XPayStationWidget.init(options);
            XPayStationWidget.open();
        };

        s.addEventListener('load', loadFunction, false);
    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }

    сlosePaystationWidget() {
		if (typeof XPayStationWidget !== undefined) {
			XPayStationWidget.off();
		}

		var elements = document.getElementsByClassName('xpaystation-widget-lightbox');
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.display = 'none';
		}
	}

    formatPrice(amount: number, currency: string = 'USD') {
        if (currency == '') {
            console.warn('In PA there is no price provided for certain item');
            return '';
        }

        let row: XsollaStoreCurrency = this.currencyFormat.json[currency];

        if(!row) {
            console.warn(`Failed to format price ${amount.toString()} ${currency}`);
            return '';
        }

        let sanitizedAmount = amount.toFixed(row.fractionSize);
        let firstReplace = row.symbol.template.replace('$', row.symbol.grapheme);
        return firstReplace.replace('1', sanitizedAmount);
    }

    isStoreIteminBattlepassGroup(storeItem:StoreItem) {
        let found = storeItem.groups.find(x => x.name == '#BATTLEPASS#');
        return found != null;
    }

    static getPublishingPlatformName() {
        if(!Xsolla.settings.useCrossPlatformAccountLinking) {
            return '';
        }

        return Xsolla.settings.platform.toString();
    }

}

export interface XsollaStoreCurrencySymbol {
    grapheme: string,
    template: string,
    rtl: boolean
}

export interface XsollaStoreCurrency {

    name: string,
    description: string,
    fractionSize: number,
    symbol: XsollaStoreCurrencySymbol
}