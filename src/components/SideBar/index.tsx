import React, { memo, useMemo, useEffect, useState } from "react"
import {
  IonList,
  IonItem,
  IonListHeader,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonCol,
  IonText,
} from "@ionic/react"
import { categories } from "../CategoryOptions"
import { capitalize } from "../../util"
import {
  flashlightOutline,
  ribbonOutline,
  calendarOutline,
  home,
} from "ionicons/icons"
import { useHistory, useParams } from "react-router"
import { GetPwaCategoryUrl, RouteMap } from "../../routes"
import "./styles.css"

export const standardCategories = [
  { category: "HOME", value: "home", icon: home },
  { category: "TOP", value: "", icon: ribbonOutline },
  { category: "NEW", value: "NEW", icon: calendarOutline },
  { category: "DISCOVER", value: "TRENDING", icon: flashlightOutline },
]

interface ContainerProps {
  category: string | undefined
}

const SideBar: React.FC<ContainerProps> = ({ category }) => {
  const history = useHistory()

  const onPress = (category: string) => {
    if (category.toLowerCase() === "home") {
      history.push(RouteMap.HOME)
    } else {
      history.push(GetPwaCategoryUrl(category.toLowerCase()))
    }
  }

  const selected = (cat: string) => {
    return !category ? cat === "" : cat.toLowerCase() === category.toLowerCase()
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
    [category]
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
    [category]
  )
  return (
    <IonCol size="2.8" className="side">
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
