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
  ADMIN_FEATURE: "/admin/feature",
  CATEGORIES: "/categories",
  PWAS: "/pwas/:category?",
  HOME: "/home",
  SEARCH: "/search",
  SETTINGS: "/settings/:section?",
  ADD: "/add",
  DEVELOPER: "/dev/:username",
  NOTIFICATIONS: "/notifications",
  ADMIN_ROOT: "/admin",
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

const GetSettingSectionUrl = (section: string) =>
  RouteMap.SETTINGS.replace(":section?", section)

export {
  RouteMap,
  GetPWADetailUrl,
  GetMyPWADetailUrl,
  GetPwaCategoryUrl,
  GetSettingSectionUrl,
}
