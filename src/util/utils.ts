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
        loadImage(file, (img) => {
            (img as HTMLCanvasElement).toBlob(
                (blob) => {
                    resolve(blob)
                },
                'image/jpeg'
            )
        }, {orientation: true})
    })
}