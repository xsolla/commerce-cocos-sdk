// Copyright 2021 Xsolla Inc. All Rights Reserved.

export class XsollaUrlBuilder {
    private _url: string;
    private _parameters = {};

    constructor(url:string) {
        this._url = url;
    }

    build() : string {
        var queryParamsStr: string = '';
        for (var key in this._parameters) {
            queryParamsStr += queryParamsStr ? '&' : '?';
            queryParamsStr += key + '=' + encodeURIComponent(this._parameters[key]);
        }
        return this._url + queryParamsStr;
    }

    addStringParam(paramName:string, paramValue:string, ignoreEmpty:boolean = true) : XsollaUrlBuilder {
        if (ignoreEmpty && !paramValue) {
            return;
        }
        this._parameters[paramName] = paramValue;
        return this;
    }

    addNumberParam(paramName:string, paramValue:number) : XsollaUrlBuilder {
        this._parameters[paramName] = paramValue.toString();
        return this;
    }

    addBoolParam(paramName:string, paramValue:boolean, asNumber:boolean = true) : XsollaUrlBuilder {
        if (asNumber) {
            this._parameters[paramName] = paramValue ? '1' : '0'
        }
        else {
            this._parameters[paramName] = paramValue ? 'true' : 'false'
        }
        return this;
    }
}