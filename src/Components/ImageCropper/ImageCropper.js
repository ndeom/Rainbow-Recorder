import React from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({ inputImg }) {
    const [blob, setBlob] = React.useState(null);
    // const [inputImg, setInputImg] = React.useState("");

    const getBlob = (blob) => setBlob(blob);

    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);

    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels);
        getBlob(croppedImage);
    };

    return (
        <div className="cropper">
            <Cropper
                image={inputImg}
                zoom={zoom}
                onZoomChange={setZoom}
                aspect={1}
                crop={crop}
                cropShape="round" // make into option in config object
                showGrid="false"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                // style={{ containerStyle: {} }}
            />
        </div>
    );
}

// create the image with a src of the base64 string
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = 250;
    canvas.height = 250;

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg");
    });
};
