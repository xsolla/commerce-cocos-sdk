// Copyright 2021 Xsolla Inc. All Rights Reserved.

export class XsollaUrlBuilder {
    private _url;
    private _parameters: Record<string, string> = {};

    constructor(url:string) {
        this._url = url;
    }

    build() : string {
        let url = new URL(this._url);        
        url.search = new URLSearchParams(this._parameters).toString();
        return url.toString();
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