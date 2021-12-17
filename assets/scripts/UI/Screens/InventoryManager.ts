// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, ScrollView, Prefab, instantiate, Button } from 'cc';
import { InventoryItem, SubscriptionItem, XsollaInventory} from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { StoreItem, XsollaStore } from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { TokenStorage } from '../../Common/TokenStorage';
import { GroupsItemComponent } from '../Misc/GroupsItemComponent';
import { InventoryItemComponent } from '../Misc/InventoryItemComponent';
import { UIManager, UIScreenType } from '../UIManager';
import { InventoryItemInfoManager } from './InventoryItemInfoManager';
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

    storeItems: Array<StoreItem>;

    inventoryItems: Array<InventoryItem>;

    subscriptionItems: Array<SubscriptionItem>;

    itemGroups: Map<string, string>;

    selectedGroup: string;

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
        XsollaInventory.getInventory(TokenStorage.getToken().access_token, null, inventoryData => {
            this.inventoryItems = inventoryData.items.filter(x => x.type != 'virtual_currency');
            XsollaInventory.getSubscriptions(TokenStorage.getToken().access_token, null, subscriptionData => {
                this.subscriptionItems = subscriptionData.items;
                XsollaStore.getVirtualItems('', '', [], storeItemsData => {
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
                }, error => {
                    console.log(error);
                    UIManager.instance.openErrorScreen(error.description);
                });
            }, error => {
                console.log(error);
                UIManager.instance.openErrorScreen(error.description);
            });
        }, error => {
            console.log(error);
            UIManager.instance.openErrorScreen(error.description);
        });
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu, this.node);
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
        for (let i = 0; i < this.inventoryItems.length; ++i) {
            let isAll = this.selectedGroup == 'all_items';
            let isUngrouped =  this.selectedGroup == 'ungrouped' && this.inventoryItems[i].groups.length == 0;
            let found = this.inventoryItems[i].groups.find(x => x.external_id == this.selectedGroup);
            if(isAll || isUngrouped || found) {
                let inventoryItem = instantiate(this.inventoryItemPrefab);
                this.itemsList.content.addChild(inventoryItem);
                let itemData = this.inventoryItems[i];
                let intentoryItemComponent = inventoryItem.getComponent(InventoryItemComponent);
                intentoryItemComponent.init(itemData, this, this.getSubscriptionExpirationTime(this.inventoryItems[i].sku));
            }
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
            let groupItemComponent = groupItem.getComponent(GroupsItemComponent);
            groupItem.on(GroupsItemComponent.GROUP_CLICK, this.groupSelected, this);
            groupItemComponent.init(groupData[0], groupData[1]);
        }
    }

    destroyGroups() {
        for(let groupItem of this.groupsList.content.children) {
            groupItem.off(GroupsItemComponent.GROUP_CLICK, this.groupSelected, this);
        }
        this.groupsList.content.destroyAllChildren();
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

    showItemInfo(item: InventoryItem, expires_at: number) {
        this.itemInfoManager.init(item, this.storeItems.find(x => x.sku == item.sku), expires_at, this);
        this.openItemInfoScreen();
    }

    getSubscriptionExpirationTime(sku: string): number {
        for(let subscription of this.subscriptionItems) {
            if(sku == subscription.sku) {
                return subscription.expired_at;
            }
        }
        return 0;
    }
}