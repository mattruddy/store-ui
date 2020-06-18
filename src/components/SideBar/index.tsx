import React, { memo, useMemo } from "react"
import {
  IonList,
  IonItem,
  IonListHeader,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonContent,
} from "@ionic/react"
import { categories } from "../CategoryOptions"
import { capitalize } from "../../util"
import {
  flashlightOutline,
  ribbonOutline,
  calendarOutline,
  home,
  search,
} from "ionicons/icons"
import { useLocation } from "react-router"
import { GetPwaCategoryUrl, RouteMap } from "../../routes"
import "./styles.css"

export const standardCategories = [
  { category: "SEARCH", value: "search", icon: search },
  { category: "HOME", value: "home", icon: home },
  { category: "TOP", value: "", icon: ribbonOutline },
  { category: "NEW", value: "NEW", icon: calendarOutline },
  { category: "DISCOVER", value: "TRENDING", icon: flashlightOutline },
]

const SideBar: React.FC = () => {
  const location = useLocation()

  const href = (category: string): string => {
    if (category.toLowerCase() === "home") {
      return RouteMap.HOME
    } else if (category.toLowerCase() === "search") {
      return RouteMap.SEARCH
    } else {
      return GetPwaCategoryUrl(category.toLowerCase())
    }
  }

  const selected = (cat: string) => {
    const pathname = location.pathname
    if (cat === "") {
      return pathname.endsWith("pwas/") || pathname.endsWith("pwas")
    } else {
      return pathname.toLocaleLowerCase().includes(cat.toLowerCase())
    }
  }

  const renderStandardCategories = useMemo(
    () =>
      standardCategories.map((cat, i) => (
        <IonItem
          key={i}
          className={`StandardCategoriesItem SideBarCategory item ${
            selected(cat.value) && "Selected"
          }`}
          lines="none"
          routerLink={href(cat.value)}
        >
          <IonIcon
            className={`StandardCategoriesItemIcon`}
            icon={cat.icon}
            color={selected(cat.value) ? "primary" : undefined}
          />
          {capitalize(cat.category)}
        </IonItem>
      )),
    [location]
  )

  const renderCategories = useMemo(
    () =>
      categories.map((cat, i) => (
        <IonItem
          key={i}
          className={`CategoriesItem SideBarCategory item ${
            selected(cat.category) && "Selected"
          }`}
          routerLink={href(cat.category)}
        >
          <IonIcon
            className="CategoriesItemIcon"
            icon={cat.icon}
            color={selected(cat.category) ? "primary" : undefined}
          />
          {capitalize(cat.category)}
        </IonItem>
      )),
    [location]
  )
  return (
    <IonContent className="side">
      <IonList className="SideBar">
        <IonItemGroup>{renderStandardCategories}</IonItemGroup>
        <IonListHeader>
          <IonLabel>CATEGORIES</IonLabel>
        </IonListHeader>
        <IonItemGroup>{renderCategories}</IonItemGroup>
      </IonList>
    </IonContent>
  )
}

export default memo(SideBar)
