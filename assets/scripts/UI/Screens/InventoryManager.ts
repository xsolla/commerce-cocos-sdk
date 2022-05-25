// Copyright 2022 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, ScrollView, Prefab, instantiate, Button } from 'cc';
import { InventoryItem as XsollaInventoryItem, TimeLimitedItem, VirtualCurrencyBalance, XsollaInventory} from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { StoreItem, XsollaCatalog } from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { TokenStorage } from "db://xsolla-commerce-sdk/scripts/common/TokenStorage";
import { GroupsItem } from '../Misc/GroupsItem';
import { InventoryItem } from '../Misc/InventoryItem';
import { UIManager, UIScreenType } from '../UIManager';
import { InventoryItemInfoManager } from './InventoryItemInfoManager';
import { VCBalanceItem } from '../Misc/VCBalanceItem';
import { StoreManager } from './StoreManager';
const { ccclass, property } = _decorator;

@ccclass('InventoryManager')
export class InventoryManager extends Component {

    @property(Button)
    backBtn: Button;

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

    @property(InventoryItemInfoManager)
    itemInfoManager: InventoryItemInfoManager;

    @property(Prefab)
    inventoryItemPrefab: Prefab;

    @property(Prefab)
    groupItemPrefab: Prefab;

    @property(Prefab)
    cellContainerPrefab: Prefab;

    @property(Prefab)
    vcBalanceItemPrefab: Prefab;

    storeItems: Array<StoreItem>;

    inventoryItems: Array<XsollaInventoryItem>;

    vcBalanceItems: Array<VirtualCurrencyBalance>;

    timeLimitedItemsData: Array<TimeLimitedItem>;

    itemGroups: Map<string, string>;

    selectedGroup: string;

    @property(Node)
    vcBalanceList: Node;

    onEnable() {
        this.addListeners();
        this.init();
    }

    onDisable() {
        this.removeListeners();
        this.hideAllScreens();
    }

    addListeners () {
        this.backBtn.node.on(Button.EventType.CLICK, this.onBackClicked, this);
    }

    removeListeners () {
        this.backBtn.node.off(Button.EventType.CLICK, this.onBackClicked, this);
    }

    init() {
        UIManager.instance.showLoaderPopup(true);
        XsollaInventory.getInventory(TokenStorage.getToken().access_token, null, inventoryData => {
            this.inventoryItems = inventoryData.items.filter(x => x.type != 'virtual_currency');
            XsollaInventory.getTimeLimitedItems(TokenStorage.getToken().access_token, null, timeLimitedItemsData => {
                this.timeLimitedItemsData = timeLimitedItemsData.items;
                XsollaCatalog.getCatalog('', '', [], storeItemsData => {
                    this.storeItems = storeItemsData.items;
                    if(this.inventoryItems.length > 0) {
                        this.populateGroupsList();
                        this.groupSelected('all_items');
                        this.itemsList.scrollToTop();
                        this.groupsList.scrollToTop();
                        this.openAllItemsScreen();
                    } else {
                        this.openNoItemsScreen();
                    }
                    this.refreshVCBalance();
                    UIManager.instance.showLoaderPopup(false);
                }, error => {
                    console.log(error);
                    UIManager.instance.showErrorPopup(error.description);
                    UIManager.instance.showLoaderPopup(false);
                });
            }, error => {
                console.log(error);
                UIManager.instance.showErrorPopup(error.description);
                UIManager.instance.showLoaderPopup(false);
            });
        }, error => {
            console.log(error);
            UIManager.instance.showErrorPopup(error.description);
            UIManager.instance.showLoaderPopup(false);
        });
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
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
        let index = 0;
        let Container:Node;
        let cellsPerRow = 2;
        for (let i = 0; i < this.inventoryItems.length; ++i) {
            let isAll = this.selectedGroup == 'all_items';
            let isUngrouped =  this.selectedGroup == 'ungrouped' && this.inventoryItems[i].groups.length == 0;
            let found = this.inventoryItems[i].groups.find(x => x.external_id == this.selectedGroup);
            if(isAll || isUngrouped || found) {
                if(index % cellsPerRow == 0) {
                    Container = instantiate(this.cellContainerPrefab);
                    this.itemsList.content.addChild(Container);
                }
                let inventoryItem = instantiate(this.inventoryItemPrefab);
                Container.addChild(inventoryItem);
                let itemData = this.inventoryItems[i];
                inventoryItem.getComponent(InventoryItem).init(itemData, this, this.getSubscriptionExpirationTime(this.inventoryItems[i].sku));
                index++;
            }
        }
        let cellsToAdd = 0;
        if(index  % cellsPerRow > 0) {
            cellsToAdd = cellsPerRow - index % cellsPerRow;
        }
        for( let i = 0; i < cellsToAdd; i++) {
            let inventoryItem = instantiate(this.inventoryItemPrefab);
            Container.addChild(inventoryItem);
            inventoryItem.getComponent(InventoryItem).init(null, this);
        }
        this.itemsList.scrollToTop();
    }

    populateGroupsList() {
        this.destroyGroups();
        this.itemGroups = new Map<string, string>();
        this.itemGroups.set('all_items', 'all');
        for(let i = 0; i < this.inventoryItems.length; ++i) {
            if(this.inventoryItems[i].groups.length > 0) {
                for(let group of this.inventoryItems[i].groups) {
                    if(group.name != '#BATTLEPASS#') {
                        this.itemGroups.set(group.external_id, group.name);
                    }
                }
            } else {
                this.itemGroups.set('Ungrouped', 'Ungrouped');
            }
        }
        for(let groupData of this.itemGroups) {
            let groupItem = instantiate(this.groupItemPrefab);
            this.groupsList.content.addChild(groupItem);
            groupItem.getComponent(GroupsItem).init(groupData[0], groupData[1]);
            groupItem.on(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        }
    }

    destroyGroups() {
        for(let groupItem of this.groupsList.content.children) {
            groupItem.off(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        }
        this.groupsList.content.destroyAllChildren();
    }

    groupSelected(groupId: string) {
        this.selectedGroup = groupId;
        for(let groupItem of this.groupsList.content.getComponentsInChildren(GroupsItem)) {
            groupItem.select(groupItem.groupId == this.selectedGroup);
        }
        this.populateItemsList();
    }

    showItemInfo(item: XsollaInventoryItem, expires_at: number) {
        this.itemInfoManager.init(item, this.storeItems.find(x => x.sku == item.sku), expires_at, this);
        this.openItemInfoScreen();
    }

    getSubscriptionExpirationTime(sku: string): number {
        for(let subscription of this.timeLimitedItemsData) {
            if(sku == subscription.sku) {
                return subscription.expired_at;
            }
        }
        return 0;
    }

    refreshVCBalance() {
        XsollaInventory.getVirtualCurrencyBalance(TokenStorage.getToken().access_token, null, currencyData => {
            this.vcBalanceItems = currencyData.items;
            this.populateVCBalanceList();
        }, error => {
            console.log(error);
            UIManager.instance.showErrorPopup(error.description);
        });
    }

    populateVCBalanceList() {
        this.vcBalanceList.destroyAllChildren();
        for (let i = 0; i < this.vcBalanceItems.length; ++i) {
            let vcBalanceItem = instantiate(this.vcBalanceItemPrefab);
            this.vcBalanceList.addChild(vcBalanceItem);
            let itemData = this.vcBalanceItems[i];
            vcBalanceItem.getComponent(VCBalanceItem).init(itemData);
            vcBalanceItem.on(VCBalanceItem.CURRENCY_CLICK, this.currencyClicked, this);
        }
    }

    currencyClicked() {
        UIManager.instance.openScreen(UIScreenType.Store);
        UIManager.instance.getScreen().getComponent(StoreManager).SetIsCurrenciesOpen(true);
    }
}