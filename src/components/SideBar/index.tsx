import React, { memo, useMemo } from "react"
import {
  IonList,
  IonItem,
  IonListHeader,
  IonItemGroup,
  IonLabel,
  IonIcon,
} from "@ionic/react"
import { categories } from "../CategoryOptions"
import { capitalize } from "../../util"
import {
  flashlightOutline,
  ribbonOutline,
  calendarOutline,
} from "ionicons/icons"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl } from "../../routes"
import "./styles.css"

export const standardCategories = [
  { category: "TOP", value: "", icon: ribbonOutline },
  { category: "NEW", value: "NEW", icon: calendarOutline },
  { category: "DISCOVER", value: "TRENDING", icon: flashlightOutline },
]

const SideBar = () => {
  const history = useHistory()

  const onPress = (category: string) => {
    history.replace(GetPwaCategoryUrl(category.toLowerCase()))
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
          // lines="none"
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
    <IonList className="SideBar">
      <IonItemGroup>{renderStandardCategories}</IonItemGroup>
      <IonListHeader>
        <IonLabel>CATEGORIES</IonLabel>
      </IonListHeader>
      <IonItemGroup>{renderCategories}</IonItemGroup>
    </IonList>
  )
}

export default memo(SideBar)
