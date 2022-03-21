// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { _decorator, Component, Node, ScrollView, instantiate, Prefab, Button, Layout } from 'cc';
import { StoreItem as XsollaStoreItem, VirtualCurrencyPackage, ItemGroup, XsollaCatalog} from 'db://xsolla-commerce-sdk/scripts/api/XsollaCatalog';
import { InventoryItem, VirtualCurrencyBalance, XsollaInventory } from 'db://xsolla-commerce-sdk/scripts/api/XsollaInventory';
import { StoreItemInfoManager } from './StoreItemInfoManager';
import { TokenStorage } from '../../Common/TokenStorage';
import { UIManager, UIScreenType } from '../UIManager';
import { StoreItem } from '../Misc/StoreItem';
import { GroupsItem } from '../Misc/GroupsItem';
import { VCBalanceItem } from '../Misc/VCBalanceItem';
import { StoreRedeemCouponManager } from './StoreRedeemCouponManager';
const { ccclass, property } = _decorator;
 
@ccclass('StoreManager')
export class StoreManager extends Component {

    @property(Button)
    backBtn: Button;

    @property(Button)
    redeemCouponBtn: Button;

    @property(Node)
    allItemsScreen: Node;

    @property(Node)
    noItemsScreen: Node;

    @property(Node)
    itemInfoScreen: Node;

    @property(Node)
    redeemCouponScreen: Node;

    @property(ScrollView)
    itemsList: ScrollView;

    @property(ScrollView)
    groupsList: ScrollView;

    @property(Node)
    vcBalanceList: Node;

    @property(StoreItemInfoManager)
    itemInfoManager: StoreItemInfoManager;

    @property(StoreRedeemCouponManager)
    redeemCouponManager: StoreRedeemCouponManager;

    @property(Prefab)
    storeItemPrefab: Prefab;

    @property(Prefab)
    bundleItemPrefab: Prefab;

    @property(Prefab)
    groupItemPrefab: Prefab;

    @property(Prefab)
    vcBalanceItemPrefab: Prefab;

    @property(Prefab)
    cellContainerPrefab: Prefab;

    storeItems: Array<XsollaStoreItem>;

    inventoryItems: Array<InventoryItem>;

    vcBalanceItems: Array<VirtualCurrencyBalance>;

    vcPackageitems: Array<VirtualCurrencyPackage>;

    itemGroups: Map<string, string>;

    currencyGroups: Map<string, string>;

    selectedGroup: string;

    private _isCurrenciesOpen: boolean = false;

    start() {
    }

    onEnable() {
        this.addListeners();
        this.redeemCouponManager.init(this);
        UIManager.instance.showLoaderPopup(true);
        XsollaCatalog.getCatalog('', '', [], storeItemsData => {
            XsollaCatalog.getVirtualCurrencyPackages('', '', [], currencyPackagesData => {
                this.vcPackageitems = currencyPackagesData.items;
                for(let currencyPackage of this.vcPackageitems) {
                    if(currencyPackage.content.length == 0) {
                        continue;
                    }
                    let group: ItemGroup = {
                        external_id: currencyPackage.content[0].sku,
                        name: currencyPackage.content[0].name,
                        description: '',
                        image_url: '',
                        level: null,
                        order: null,
                        parent_external_id: '',
                        children: []
                    };
                    currencyPackage.groups.push(group);
                }
                XsollaCatalog.getBundleList('', '', [], bundlesList => {
                    XsollaInventory.getInventory(TokenStorage.getToken().access_token, null, inventoryData => {
                        UIManager.instance.showLoaderPopup(false);
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

                            // fill item groups
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

                            // fill currency groups
                            this.currencyGroups = new Map<string, string>();
                            this.currencyGroups.set('all_items', 'all');
                            for(let i = 0; i < this.vcPackageitems.length; ++i) {
                                if(this.vcPackageitems[i].groups.length > 0) {
                                    for(let group of this.vcPackageitems[i].groups) {
                                        this.currencyGroups.set(group.external_id, group.name);
                                    }
                                } else {
                                    this.currencyGroups.set('Ungrouped', 'Ungrouped');
                                }
                            }

                            this.changeState(this._isCurrenciesOpen);
                            this.itemsList.scrollToTop();
                            this.groupsList.scrollToTop();
                            this.openAllItemsScreen();
                        } else {
                            this.openNoItemsScreen();
                        }
                        this.refreshVCBalance();
                    }, error => {
                        UIManager.instance.showLoaderPopup(false);
                        console.log(error);
                        UIManager.instance.showErrorPopup(error.description);
                    });
                }, error => {
                    UIManager.instance.showLoaderPopup(false);
                    console.log(error);
                    UIManager.instance.showErrorPopup(error.description);
                });
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error);
                UIManager.instance.showErrorPopup(error.description);
            });
        }, err => {
            UIManager.instance.showLoaderPopup(false);
            console.log(err);
            UIManager.instance.showErrorPopup(err.description);
        })
    }

    onDisable() {
        this.removeListeners();
        this.hideAllScreens();
    }

    addListeners () {
        this.backBtn.node.on(Button.EventType.CLICK, this.onBackClicked, this);
        this.redeemCouponBtn.node.on(Button.EventType.CLICK, this.onRedeemCouponClicked, this);
    }

    removeListeners () {
        this.backBtn.node.off(Button.EventType.CLICK, this.onBackClicked, this);
        this.redeemCouponBtn.node.off(Button.EventType.CLICK, this.onRedeemCouponClicked, this);
    }

    onBackClicked() {
        UIManager.instance.openScreen(UIScreenType.MainMenu);
    }

    onRedeemCouponClicked() {
        this.openRedeemCouponScreen();
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

    openRedeemCouponScreen() {
        this.hideAllScreens();
        this.redeemCouponScreen.active = true;
    }

    hideAllScreens() {
        this.allItemsScreen.active = false;
        this.noItemsScreen.active = false;
        this.itemInfoScreen.active = false;
        this.redeemCouponScreen.active = false;
    }

    SetIsCurrenciesOpen(newValue: boolean) {
        this._isCurrenciesOpen = newValue;
    }

    changeState(isCurrenciesOpen: boolean) {
        this._isCurrenciesOpen = isCurrenciesOpen;
        this.populateGroupsList();
        this.groupSelected('all_items');
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

    populateItemsList() {
        this.itemsList.content.destroyAllChildren();
        let items = this._isCurrenciesOpen ? this.vcPackageitems : this.storeItems;
        let index = 0;
        let Container:Node;
        let cellsPerRow = 2;
        for (let i = 0; i < items.length; ++i) {
            let isAll = this.selectedGroup == 'all_items';
            let isUngrouped =  this.selectedGroup == 'ungrouped' && items[i].groups.length == 0;
            let found = items[i].groups.find(x => x.external_id == this.selectedGroup);
            if(isAll || isUngrouped || found) {
                if(index % cellsPerRow == 0) {
                    Container = instantiate(this.cellContainerPrefab);
                    this.itemsList.content.addChild(Container);
                }
                let storeItem = instantiate(this.storeItemPrefab);
                Container.addChild(storeItem);
                let itemData = items[i];
                let isItemInInventory = this.inventoryItems.find(x => x.sku == this.storeItems[i].sku) != null;
                storeItem.getComponent(StoreItem).init(itemData, this, isItemInInventory);
                index++;
            }
        }
        let cellsToAdd = 0;
        if(index  % cellsPerRow > 0) {
            cellsToAdd = cellsPerRow - index % cellsPerRow;
        }
        for( let i = 0; i < cellsToAdd; i++) {
            let storeItem = instantiate(this.storeItemPrefab);
            Container.addChild(storeItem);
            storeItem.getComponent(StoreItem).init(null, this);
        }
    }

    populateGroupsList() {
        this.destroyGroups();
        let groups = this._isCurrenciesOpen ? this.currencyGroups : this.itemGroups;
        for(let groupData of groups) {
            let groupItem = instantiate(this.groupItemPrefab);
            this.groupsList.content.addChild(groupItem);
            groupItem.getComponent(GroupsItem).init(groupData[0], groupData[1]);
            groupItem.on(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        }
    }

    populateVCBalanceList() {
        this.destroyVCBalanceList();
        for (let i = 0; i < this.vcBalanceItems.length; ++i) {
            let vcBalanceItem = instantiate(this.vcBalanceItemPrefab);
            this.vcBalanceList.addChild(vcBalanceItem);
            let itemData = this.vcBalanceItems[i];
            vcBalanceItem.getComponent(VCBalanceItem).init(itemData);
            vcBalanceItem.on(VCBalanceItem.CURRENCY_CLICK, this.currencyClicked, this);
        }
    }

    currencyClicked() {
        this.changeState(true);
    }

    destroyGroups() {
        for(let groupItem of this.groupsList.content.children) {
            groupItem.off(GroupsItem.GROUP_CLICK, this.groupSelected, this);
        }
        this.groupsList.content.destroyAllChildren();
    }

    destroyVCBalanceList() {
        for(let item of this.vcBalanceList.children) {
            item.off(VCBalanceItem.CURRENCY_CLICK, this.currencyClicked, this);
        }
        this.vcBalanceList.destroyAllChildren();
    }

    groupSelected(groupId: string) {
        this.selectedGroup = groupId;
        for(let groupItem of this.groupsList.content.getComponentsInChildren(GroupsItem)) {
            groupItem.select(groupItem.groupId == this.selectedGroup);
        }
        this.populateItemsList();
    }

    showItemInfo(item: XsollaStoreItem | VirtualCurrencyPackage) {
        let isBundle = item.bundle_type && item.bundle_type.length > 0 && item.bundle_type != 'virtual_currency_package';
        if(isBundle) {
            UIManager.instance.showLoaderPopup(true);
            XsollaCatalog.getSpecifiedBundle(item.sku, bundle => {
                UIManager.instance.showLoaderPopup(false);
                this.itemInfoManager.init(item, this, bundle.content);
                this.openItemInfoScreen();
            }, error => {
                UIManager.instance.showLoaderPopup(false);
                console.log(error.description);
                UIManager.instance.showErrorPopup(error.description);
            });
            return;
        }

        this.itemInfoManager.init(item, this);
        this.openItemInfoScreen();
    }

    isStoreIteminBattlepassGroup(storeItem: XsollaStoreItem) {
        let found = storeItem.groups.find(x => x.name == '#BATTLEPASS#');
        return found != null;
    }
}