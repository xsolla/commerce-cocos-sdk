// Copyright 2021 Xsolla Inc. All Rights Reserved.

export class UrlBuilder {
    private _url: string;
    private _queryParameters = {};
    private _pathParameters = {};

    constructor(url:string) {
        this._url = url;
    }

    build() : string {
        for (var key in this._pathParameters) {
            let paramPlaceholder = '{' + key + '}';
            if(this._url.includes(paramPlaceholder)) {
                this._url = this._url.replace(paramPlaceholder, this._pathParameters[key]);
            }
        }

        var queryParamsStr: string = '';
        for (var key in this._queryParameters) {
            queryParamsStr += queryParamsStr ? '&' : '?';
            queryParamsStr += key + '=' + encodeURIComponent(this._queryParameters[key]);
        }
        return this._url + queryParamsStr;
    }

    setPathParam(paramName:string, paramValue:string) : UrlBuilder {
        this._pathParameters[paramName] = paramValue;
        return this;
    }

    addStringParam(paramName:string, paramValue:string, ignoreEmpty:boolean = true) : UrlBuilder {
        if (ignoreEmpty && !paramValue) {
            return this;
        }
        this._queryParameters[paramName] = paramValue;
        return this;
    }

    addArrayParam(paramName:string, paramValueArray:Array<string>, ignoreEmpty:boolean = true, asOneParam:boolean = false) : UrlBuilder {
        if (ignoreEmpty && paramValueArray.length == 0) {
            return this;
        }    
        if (asOneParam) {
            let additionalFieldsString = paramValueArray.join(',');
            additionalFieldsString = additionalFieldsString.substring(0, additionalFieldsString.length - 2);
            this.addStringParam(paramName, additionalFieldsString, ignoreEmpty);
        }
        else {
            for (var param in paramValueArray) {
                this.addStringParam(paramName, param, ignoreEmpty);
            }
        }    
        return this;
    }

    addNumberParam(paramName:string, paramValue:number) : UrlBuilder {
        this._queryParameters[paramName] = paramValue.toString();
        return this;
    }

    addBoolParam(paramName:string, paramValue:boolean, asNumber:boolean = true) : UrlBuilder {
        if (asNumber) {
            this._queryParameters[paramName] = paramValue ? '1' : '0'
        }
        else {
            this._queryParameters[paramName] = paramValue ? 'true' : 'false'
        }
        return this;
    }
}