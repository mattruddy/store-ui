const RouteMap = {
  ROOT: "/",
  PWA_DETAIL: "/pwa/:pwaName",
  SUPPORT: "/support",
  SIGNUP: "/signup",
  LOGIN: "/login",
  PROFILE: "/profile",
  MY_PWA_DETAIL: "/mypwa/:id",
  ABOUT: "/about",
  ADMIN: "/admin",
  CATEGORIES: "/categories",
  PWAS: "/pwas/:category?",
  HOME: "/home",
}

const getPwaName = (name) => name.replace(/ /g, "-")

const GetPWADetailUrl = (name) => {
  const pwaName = getPwaName(name)
  return RouteMap.PWA_DETAIL.replace(":pwaName", pwaName)
}

const GetMyPWADetailUrl = (name) => {
  return RouteMap.MY_PWA_DETAIL.replace(":id", name)
}

const GetPwaCategoryUrl = (category) =>
  RouteMap.PWAS.replace(":category?", category)

export { RouteMap, GetPWADetailUrl, GetMyPWADetailUrl, GetPwaCategoryUrl }
