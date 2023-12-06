// Copyright 2023 Xsolla Inc. All Rights Reserved.

import { assetManager, ImageAsset, SpriteFrame, Texture2D } from "cc";

export class ImageUtils {
    
    static getBase64Image(texture: Texture2D, onComplete:(base64image: string) => void, onError?:(message: string) => void, outputFormat: string = 'png') {
        let url = texture.image.nativeUrl;
        if(url.length > 0){
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = img.naturalHeight;
                canvas.width = img.naturalWidth;
                ctx.drawImage(img, 0, 0);
                let dataURL = canvas.toDataURL(outputFormat);
                onComplete(dataURL);
            };
            img.onerror = () => {
                onError?.('error occurs during texture loading');
            }
            img.src = url;
        } else {
            onError?.(`texture's image.nativeUrl is empty`);
        }
    }

    static loadImage(url: string, onComplete:(spriteFrame: SpriteFrame) => void, onError?:(error: string) => void) {
        assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
            if(err != null || imageAsset == null) {
                assetManager.loadRemote<ImageAsset>(url, (secondLoadErr, secondLoadImageAsset) => {
                    if(secondLoadErr != null || secondLoadImageAsset == null) {
                        if(secondLoadImageAsset == null) {
                            onError?.(secondLoadErr.message);
                        }
                        return;
                    }
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = secondLoadImageAsset;
                    spriteFrame.texture = texture;
                    onComplete(spriteFrame);
                });
                return;
            }
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            texture.image = imageAsset;
            spriteFrame.texture = texture;
            onComplete(spriteFrame);
        });
    }
}