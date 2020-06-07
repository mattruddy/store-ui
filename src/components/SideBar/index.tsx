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
import { useHistory, useLocation } from "react-router"
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
  const history = useHistory()
  const location = useLocation()

  const onPress = (category: string) => {
    if (category.toLowerCase() === "home") {
      history.push(RouteMap.HOME)
    } else if (category.toLowerCase() === "search") {
      history.push(RouteMap.SEARCH)
    } else {
      history.push(GetPwaCategoryUrl(category.toLowerCase()))
    }
  }

  const selected = (cat: string) => {
    const pathname = location.pathname
    return (
      pathname.includes("pwas") &&
      pathname.toLocaleLowerCase().includes(cat.toLowerCase())
    )
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
          button={true}
          onClick={() => onPress(cat.value)}
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
          button={true}
          onClick={() => onPress(cat.category)}
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
