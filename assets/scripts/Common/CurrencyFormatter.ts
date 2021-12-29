// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { JsonAsset, resources} from "cc";

export class CurrencyFormatter {

    private static _currencyFormat:JsonAsset;

    static init() {
        resources.load("currency-format", JsonAsset, (err, data) => {
            if (err) {
                console.warn('currency-format json was not loaded correctly');
            } else {
                this._currencyFormat = data;
            }
        });
    }

    static formatPrice(amount: number, currency: string = 'USD') {
        if (currency == '') {
            console.warn('In PA there is no price provided for certain item');
            return '';
        }
        
        if(this._currencyFormat == null) {
            console.warn('currency-format json was not loaded correctly');
            return '';
        }

        let row: XsollaStoreCurrency = this._currencyFormat.json[currency];

        if(!row) {
            console.warn(`Failed to format price ${amount.toString()} ${currency}`);
            return '';
        }

        let sanitizedAmount = amount.toFixed(row.fractionSize);
        let firstReplace = row.symbol.template.replace('$', row.symbol.grapheme);
        return firstReplace.replace('1', sanitizedAmount);
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