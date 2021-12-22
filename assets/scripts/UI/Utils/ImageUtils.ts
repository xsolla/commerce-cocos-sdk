// Copyright 2021 Xsolla Inc. All Rights Reserved.

import { Texture2D } from "cc";

export class ImageUtils {
    
    static getBase64Image(texture: Texture2D, onComplete:(base64image: string) => void, onError?:(message: string) => void, outputFormat: string = 'png') {
        let data = texture.image.data;
        if(data instanceof HTMLImageElement){
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
            img.src = data.src;
        } else {
            onError?.('texture must be HTMLImageDocument');
        }
    }
}