const isOnMobileBrowser = (userAgent: string) =>
  /iPhone|iPad|iPod|Android|Windows/i.test(userAgent)

const getConnectionProps = ({
  downlink,
  effectiveType,
  onchange,
  rtt,
  saveDate,
}: any) => ({ downlink, effectiveType, onchange, rtt, saveDate })

const getScreenProps = ({
  availHeight,
  availLeft,
  availTop,
  availWidth,
  colorDepth,
  height,
  // orientation: { angle, onchange, type },
  pixelDepth,
  width,
}: any) => ({
  availHeight,
  availLeft,
  availTop,
  availWidth,
  colorDepth,
  height,
  // orientation: { angle, onchange, type },
  pixelDepth,
  width,
})

const getNavigatorProps = ({
  appCodeName,
  appName,
  appVersion,
  bluetooth,
  clipboard,
  connection,
  cookieEnabled,
  credentials,
  deviceMemory,
  doNotTrack,
  geolocation,
  hardwareConcurrency,
  keyboard,
  language,
  languages,
  locks,
  maxTouchPoints,
  mediaCapabilities,
  // mediaDevices: { ondevicechange },
  // mediaSession: { metadata, playbackState },
  mimeTypes,
  onLine,
  permissions,
  platform,
  plugins,
  // presentation: { defaultRequest, receiver },
  product,
  productSub,
  // serviceWorker: { controller, oncontrollerchange, onmessage },
  storage,
  usb,
  // userActivation: { hasBeenActive, isActive },
  userAgent,
  vendor,
  vendorSub,
}: any) => ({
  appCodeName,
  appName,
  appVersion,
  bluetooth,
  clipboard,
  connection: connection ? getConnectionProps(connection) : {},
  cookieEnabled,
  credentials,
  deviceMemory,
  doNotTrack,
  geolocation,
  hardwareConcurrency,
  keyboard,
  language,
  languages,
  locks,
  maxTouchPoints,
  mediaCapabilities,
  // mediaDevices: { ondevicechange },
  // mediaSession: { metadata, playbackState },
  mimeTypes,
  onLine,
  permissions,
  platform,
  plugins,
  // presentation: { defaultRequest, receiver },
  product,
  productSub,
  // serviceWorker: { controller, oncontrollerchange, onmessage },
  storage,
  usb,

  userAgent,
  vendor,
  vendorSub,
})

const getWindowDimensions = () => {
  const {
    innerHeight,
    innerWidth,
    screen,
    matchMedia,
    navigator,
    performance,
  } = window

  const isMobile = innerWidth < 768

  return {
    innerHeight,
    innerWidth,
    screen: screen ? getScreenProps(screen) : {},
    matchMedia,
    navigator: navigator ? getNavigatorProps(navigator) : {},
    performance,
    isMobile,
    // navBarHeight: isMobile ? 64 : 68,
    navBarHeight: 64,
    isInStandalone: matchMedia("(display-mode: standalone)").matches,
    isOnMobileBrowser: isOnMobileBrowser(window.navigator.userAgent),
  } as WindowDimensions
}  

export interface WindowDimensions {
  innerHeight: number
  innerWidth: number
  screen: Screen
  matchMedia: (query: string) => MediaQueryList
  navigator: Navigator
  performance: Performance
  isMobile: boolean
  navBarHeight: number
  isInStandalone: boolean
  isOnMobileBrowser: boolean
}

export { isOnMobileBrowser, getWindowDimensions }
