// Copyright 2023 Xsolla Inc. All Rights Reserved.

export class UrlBuilder {
    private _url: string;
    private _queryParameters:Array<QueryParam> = [];
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
        var querySymbol = this._url.indexOf('?') > 0 ? '&' : '?';
        for (let i = 0; i < this._queryParameters.length; ++i) {
            let queryParam = this._queryParameters[i];
            queryParamsStr += querySymbol + queryParam.key + '=' + encodeURIComponent(queryParam.value);
            if (querySymbol == '?') {
                querySymbol = '&';
            }
        }
        return this._url + queryParamsStr;
    }

    setPathParam(paramName:string, paramValue:string) : UrlBuilder {
        this._pathParameters[paramName] = paramValue;
        return this;
    }

    addStringParam(paramName:string, paramValue:string | number, ignoreEmpty:boolean = true) : UrlBuilder {
        if (ignoreEmpty && !paramValue) {
            return this;
        }

        if(typeof paramValue == 'number') {
            this._queryParameters.push({key:paramName, value:(paramValue as number).toString()});
        }

        if(typeof paramValue == 'string') {
            this._queryParameters.push({key:paramName, value:(paramValue as string)});
        }

        return this;
    }

    addArrayParam(paramName:string, paramValueArray:Array<string | number>, ignoreEmpty:boolean = true, asOneParam:boolean = false) : UrlBuilder {
        if (ignoreEmpty && paramValueArray.length == 0) {
            return this;
        }    
        if (asOneParam) {
            let additionalFieldsString = paramValueArray.join(',');
            additionalFieldsString = additionalFieldsString.substring(0, additionalFieldsString.length - 2);
            this.addStringParam(paramName, additionalFieldsString, ignoreEmpty);
        }
        else {
            for (let i = 0; i < paramValueArray.length; ++i) {
                this.addStringParam(paramName, paramValueArray[i], ignoreEmpty);
            }
        }    
        return this;
    }

    addNumberParam(paramName:string, paramValue:number) : UrlBuilder {
        this._queryParameters.push({key: paramName, value: paramValue.toString()});
        return this;
    }

    addBoolParam(paramName:string, paramValue:boolean, asNumber:boolean = true) : UrlBuilder {
        if (asNumber) {
            this._queryParameters.push({key: paramName, value :paramValue ? '1' : '0'});
        }
        else {
            this._queryParameters.push({key:paramName, value: paramValue ? 'true' : 'false'});
        }
        return this;
    }
}

interface QueryParam {
    key: string;
    value: string;
}