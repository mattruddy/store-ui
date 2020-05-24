import loadImage from "blueimp-load-image"
import moment from "moment"
import ReactGA from "react-ga"

const blobToFile = (blob: Blob, fileName: string): File => {
  const b: any = blob
  b.lastModifiedDate = new Date()
  return new File([blob], fileName)
}

const fixFilesRotation = async (files: File[]) => {
  for (let i = 0; i < files.length; i++) {
    const blob = await fixRotation(files[i])
    files[i] = blobToFile(blob as Blob, files[i].name)
  }
  return files
}

function fixRotation(file: File) {
  return new Promise((resolve) => {
    loadImage(
      file,
      (img, data) => {
        if (data && data.exif) {
          //@ts-ignorets
          console.log(data.exif.get("Orientation"))
        }
        ;(img as HTMLCanvasElement).toBlob((blob) => {
          resolve(blob)
        }, "image/jpeg")
      },
      { orientation: true }
    )
  })
}

const fixRoation = (src: string): string | undefined => {
  let fixSrc
  loadImage(
    src,
    (canvas) => {
      fixSrc = (canvas as HTMLCanvasElement).toDataURL()
    },
    { orientation: true }
  )
  return fixSrc
}

const dateFormatter = (date: Date) => {
  const momentDate = moment(date.toString())
  return momentDate.format("MM/DD/YY h:mm a")
}

const shareUrl = (url: string, title: string, text: string) => {
  // @ts-ignore
  if (!navigator.share) return
  navigator
    // @ts-ignore
    .share({
      url,
      title,
      text,
    })
    .then((response: any) => {
      console.log("Successfully shared: ", response)
      ReactGA.event({
        category: "Share Url",
        action: "User shared a url!",
      })
    })
    .catch((error: any) => {
      console.log(error)
    })
}

// export const shareFile = (file) => {
//   let filesArray = [file]
//   if (!navigator.canShare || !navigator.canShare({ files: filesArray })) return
//   navigator
//     .share({
//       files: filesArray,
//       title: "My File",
//       text: "Here, Sharing my files. Keep it safe",
//     })
//     .then(() => {
//       console.log("Share was successful.")
//       ReactGA.event({
//         category: "Share File",
//         action: "User shared a file!",
//       })
//     })
//     .catch((error) => console.log("Sharing failed", error))
// }

const copyStringToClipboard = (s: string) => {
  // Create new element
  let el = document.createElement("textarea")
  // Set value (string to be copied)
  el.value = s
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "")

  document.body.appendChild(el)
  // Select text inside element
  el.select()
  // Copy text to clipboard
  document.execCommand("copy")
  // Remove temporary element
  document.body.removeChild(el)
}

const capitalize = (s: string): string => {
  return `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`
}

const noSpecialChars = (s: string): boolean => {
  return !/[^a-zA-Z0-9\s]/.test(s)
}

const validEmail = (email: string): boolean => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export {
  blobToFile,
  fixFilesRotation,
  fixRotation,
  fixRoation,
  dateFormatter,
  shareUrl,
  copyStringToClipboard,
  capitalize,
  noSpecialChars,
  validEmail,
}
