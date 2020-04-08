import loadImage from 'blueimp-load-image';

export const blobToFile = (blob: Blob, fileName: string): File => {
    const b: any = blob;
    b.lastModifiedDate = new Date();
    return new File([blob], fileName);
}

export const fixFilesRotation = async (files: File[]) => {
    for(let i = 0; i < files.length; i++) {
        const blob = await fixRotation(files[i]);
        files[i] = blobToFile(blob as Blob, files[i].name);
    }
    return files;
}

function fixRotation(file: File) {
    return new Promise((resolve) => {
        loadImage(file, (img, data) => {
            if (data && data.exif) {
                //@ts-ignorets
                console.log(data.exif.get('Orientation'));
            }
            (img as HTMLCanvasElement).toBlob(
                (blob) => {
                    resolve(blob)
                },
                'image/jpeg'
            )
        }, {orientation: true})
    })
}

export const fixRoation = (src: string): string | undefined => {
    let fixSrc;
    loadImage(
        src,
        (canvas) => {
            fixSrc = (canvas as HTMLCanvasElement).toDataURL();
        },
        {orientation: true}
    );
    return fixSrc;
}