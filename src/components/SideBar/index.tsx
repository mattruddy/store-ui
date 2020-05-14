import React, { memo, useMemo } from "react"
import {
  IonList,
  IonItem,
  IonListHeader,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonCol,
} from "@ionic/react"
import { categories } from "../CategoryOptions"
import { capitalize } from "../../util"
import {
  flashlightOutline,
  ribbonOutline,
  calendarOutline,
  home,
} from "ionicons/icons"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl, RouteMap } from "../../routes"
import "./styles.css"

export const standardCategories = [
  { category: "HOME", value: "home", icon: home },
  { category: "TOP", value: "", icon: ribbonOutline },
  { category: "NEW", value: "NEW", icon: calendarOutline },
  { category: "DISCOVER", value: "TRENDING", icon: flashlightOutline },
]

const SideBar = () => {
  const history = useHistory()

  const onPress = (category: string) => {
    if (category.toLowerCase() === "home") {
      history.push(RouteMap.HOME)
    } else {
      history.push(GetPwaCategoryUrl(category.toLowerCase()))
    }
  }

  const renderStandardCategories = useMemo(
    () =>
      standardCategories.map((cat, i) => (
        <IonItem
          key={i}
          className="StandardCategoriesItem SideBarCategory"
          lines="none"
          button={true}
          onClick={() => onPress(cat.value)}
        >
          <IonIcon className="StandardCategoriesItemIcon" icon={cat.icon} />
          {capitalize(cat.category)}
        </IonItem>
      )),
    []
  )

  const renderCategories = useMemo(
    () =>
      categories.map((cat, i) => (
        <IonItem
          key={i}
          className="CategoriesItem SideBarCategory"
          button={true}
          onClick={() => onPress(cat.category)}
        >
          <IonIcon className="CategoriesItemIcon" icon={cat.icon} />
          {capitalize(cat.category)}
        </IonItem>
      )),
    []
  )
  return (
    <IonCol size="2.5" className="side">
      <IonList className="SideBar">
        <IonItemGroup>{renderStandardCategories}</IonItemGroup>
        <IonListHeader>
          <IonLabel>CATEGORIES</IonLabel>
        </IonListHeader>
        <IonItemGroup>{renderCategories}</IonItemGroup>
      </IonList>
    </IonCol>
  )
}

export default memo(SideBar)
