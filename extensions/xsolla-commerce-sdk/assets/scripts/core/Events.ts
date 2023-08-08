// Copyright 2023 Xsolla Inc. All Rights Reserved.

export class Events {
    static SOCIAL_AUTH_SUCCESS: string = 'socialAuthSuccess';
    static SOCIAL_AUTH_ERROR: string = 'socialAuthError';
    static SOCIAL_AUTH_CANCELED: string = 'socialAuthCanceled';

    static XSOLLA_WIDGET_AUTH_SUCCESS: string = 'xsollaWidgetAuthSuccess';
    static XSOLLA_WIDGET_AUTH_ERROR: string = 'xsollaWidgetAuthError';
    static XSOLLA_WIDGET_AUTH_CANCELED: string = 'xsollaWidgetAuthCanceled';

    static AVATAR_UPDATE_SUCCESS: string = 'avatarUpdateSuccess';
    static AVATAR_UPDATE_ERROR: string = 'avatarUpdateError';

    static ACCOUNT_DATA_UPDATE_SUCCESS: string = 'accountDataUpdateSuccess';
    static ACCOUNT_DATA_UPDATE_ERROR: string = 'accountDataUpdateError';

    static SOCIAL_NETWORK_LINKING_SUCCESS: string = 'socialNetworkLinkingSuccess';
    static SOCIAL_NETWORK_LINKING_ERROR: string = 'socialNetworkLinkingError';
}