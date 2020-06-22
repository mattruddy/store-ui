import loadImage from "blueimp-load-image"
import moment from "moment"
import ReactGA from "react-ga"
import Showdown from "showdown"

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
          //console.log(data.exif.get("Orientation"))
        }
        ;(img as HTMLCanvasElement).toBlob((blob) => {
          resolve(blob)
        }, "image/jpeg")
      },
      { orientation: true }
    )
  })
}

const removeMarkdown = (input: string) =>
  input.replace(
    /(?:\[.*\]\(.*\))|(?:!\[.*\]\(.*\))|(?:```[a-z]*\n[\s\S]*?\n```)|[^\w\s]/gi,
    ""
  )

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

const dateNoTimeFormatter = (date: Date) => {
  const momentDate = moment(date.toString())
  return momentDate.format("MM/DD/YY")
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
      ReactGA.event({
        category: "Share Url",
        action: "User shared a url!",
      })
    })
    .catch((error: any) => {
      console.error(error)
    })
}

const copyStringToClipboard = (s: string) => {
  let el = document.createElement("textarea")
  el.value = s
  el.setAttribute("readonly", "")
  document.body.appendChild(el)
  el.select()
  document.execCommand("copy")
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

// $& means the whole matched string
const escapeRegExp = (s: string) =>
  s ? s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : s

const stringMatch = (
  s1: string,
  s2: string,
  caseSensitive: boolean = false
) => {
  const flags = caseSensitive ? "g" : "gi"
  const cleanString = escapeRegExp(s2)

  const regexMatch = new RegExp(cleanString, flags)
  return s1.match(regexMatch)
}

const checkValidPW = (pw: string): boolean => {
  return RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%#*?&+])[A-Za-z\\d@$!%#*?&+]{8,}$",
    "g"
  ).test(pw)
}

const validAppUpload = (
  name: string,
  description: string,
  url: string,
  category: string,
  icon: File | undefined,
  screenshots: File[] | undefined
): boolean => {
  if (
    name &&
    noSpecialChars(name) &&
    icon &&
    /^((https))/.test(url) &&
    description &&
    description.length > 0 &&
    description.length <= 1500 &&
    category &&
    screenshots &&
    screenshots.length <= 6
  ) {
    return true
  }
  return false
}

const normalizeCategory = (category: string | undefined): string => {
  return category === undefined
    ? "TOP"
    : category === "TRENDING"
    ? "DISCOVER"
    : category
}

const mdConverter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

mdConverter.setFlavor("github")

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
  stringMatch,
  checkValidPW,
  validAppUpload,
  normalizeCategory,
  mdConverter,
  removeMarkdown,
  dateNoTimeFormatter,
}
