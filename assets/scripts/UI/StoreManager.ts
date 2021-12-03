// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, ScrollView, instantiate, Prefab, Button } from 'cc';
import { StoreItem, XsollaStore} from 'db://xsolla-commerce-sdk/scripts/api/XsollaStore';
import { InventoryItem, XsollaInventory } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { TokenStorage } from '../Common/TokenStorage';
import { StoreItemInfoManager } from './StoreItemInfoManager';
import { GroupsItemComponent } from './Misc/GroupsItemComponent';
import { StoreItemComponent } from './Misc/StoreItemComponent';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;
 
@ccclass('StoreManager')
export class StoreManager extends Component {

    @property(UIManager)
    uiManager: UIManager;

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

    @property(StoreItemInfoManager)
    itemInfoManager: StoreItemInfoManager;

    @property(Prefab)
    storeItemPrefab: Prefab;

    @property(Prefab)
    bundleItemPrefab: Prefab;

    @property(Prefab)
    groupItemPrefab: Prefab;

    storeItems: Array<StoreItem>;

    inventoryItems: Array<InventoryItem>;

    itemGroups: Map<string, string>;

    selectedGroup: string;

    start() {
    }

    onEnable() {
        this.addListeners();
        XsollaStore.getVirtualItems('', '', [], storeItemsData => {
            XsollaStore.getBundles('', '', [], bundlesList => {
                XsollaInventory.getInventory(TokenStorage.getToken().access_token, null, inventoryData => {
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
        this.backBtn.node.on(Button.EventType.CLICK, this.onBackClicked, this);
    }

    removeListeners () {
        this.backBtn.node.off(Button.EventType.CLICK, this.onBackClicked, this);
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
        this.destroyGroups();
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

    isStoreIteminBattlepassGroup(storeItem:StoreItem) {
        let found = storeItem.groups.find(x => x.name == '#BATTLEPASS#');
        return found != null;
    }
}