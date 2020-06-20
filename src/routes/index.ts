const RouteMap = {
  ROOT: "/",
  PWA_DETAIL: "/pwa/:pwaName",
  SUPPORT: "/support",
  SIGNUP: "/signup",
  LOGIN: "/login",
  PROFILE: "/profile",
  MY_PWA_DETAIL: "/mypwa/:id",
  ABOUT: "/about",
  ADMIN_PWAS: "/admin/pwas",
  ADMIN_NOTIFY: "/admin/notify",
  CATEGORIES: "/categories",
  PWAS: "/pwas/:category?",
  HOME: "/home",
  SEARCH: "/search",
  SETTINGS: "/settings",
  ADD: "/add",
  DEVELOPER: "/dev/:username",
  NOTIFICATIONS: "/notifications",
}

const getPwaName = (name: string) => name.replace(/ /g, "-")

const GetPWADetailUrl = (name: string) => {
  const pwaName = getPwaName(name)
  return RouteMap.PWA_DETAIL.replace(":pwaName", pwaName)
}

const GetMyPWADetailUrl = (name?: string) => {
  return RouteMap.MY_PWA_DETAIL.replace(":id", name || "")
}

const GetPwaCategoryUrl = (category: string) =>
  RouteMap.PWAS.replace(":category?", category)

export { RouteMap, GetPWADetailUrl, GetMyPWADetailUrl, GetPwaCategoryUrl }
