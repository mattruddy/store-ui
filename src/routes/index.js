const RouteMap = {
  ROOT: "/",
  PWA_DETAIL: "/pwa/:pwaName",
  SUPPORT: "/support",
  SIGNUP: "/signup",
  LOGIN: "/login",
  PROFILE: "/profile",
  MY_PWA_DETAIL: "/mypwa/:id",
  PWAS: "/pwas",
  ABOUT: "/about",
  ADMIN: "/admin",
}

const getPwaName = (name) => name.replace(/ /g, "-")

const GetPWADetailUrl = (name) => {
  const pwaName = getPwaName(name)
  return RouteMap.PWA_DETAIL.replace(":pwaName", pwaName)
}

const GetMyPWADetailUrl = (name) => {
  // const pwaName = getPwaName(name)
  return RouteMap.PWA_DETAIL.replace(":id", name)
}

export { RouteMap, GetPWADetailUrl, GetMyPWADetailUrl }
