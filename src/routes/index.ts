const RouteMap = {
  ROOT: "/",
  PWA_DETAIL: "/pwa/:appName",
  SUPPORT: "/support",
  SIGNUP: "/signup",
  LOGIN: "/login",
  PROFILE: "/profile",
  MY_PWA_DETAIL: "/mypwa/:appName",
  ABOUT: "/about",
  ADMIN_PWAS: "/admin/pwas",
  ADMIN_NOTIFY: "/admin/notify",
  ADMIN_FEATURE: "/admin/feature",
  CATEGORIES: "/categories",
  PWAS: "/pwas/:category?",
  HOME: "/home",
  SEARCH: "/search",
  SETTINGS: "/settings",
  ADD: "/add",
  DEVELOPER: "/dev/:username",
  NOTIFICATIONS: "/notifications",
  ADMIN_ROOT: "/admin",
  RECRUITER: "/recruiter",
  DEVLOG: "/log/:appName/:id",
}

const getPwaName = (name: string) => name.replace(/ /g, "-")

const GetPWADetailUrl = (name: string) => {
  const pwaName = getPwaName(name)
  return RouteMap.PWA_DETAIL.replace(":appName", pwaName)
}

const GetMyPWADetailUrl = (name?: string) => {
  return RouteMap.MY_PWA_DETAIL.replace(":appName", name || "")
}

const GetPwaCategoryUrl = (category: string) =>
  RouteMap.PWAS.replace(":category?", category)

export { RouteMap, GetPWADetailUrl, GetMyPWADetailUrl, GetPwaCategoryUrl }
