import React, { memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonIcon,
  IonItemGroup,
  IonListHeader,
  IonLabel,
} from "@ionic/react"
import { categories } from "../../components/CategoryOptions"
import { capitalize } from "../../util"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl, RouteMap } from "../../routes"
import "./styles.css"
import { standardCategories } from "../../components/SideBar"

const Categories: React.FC = () => {
  const history = useHistory()

  const onPress = (category: string) => {
    if (category.toLowerCase() === "home") {
      history.push(RouteMap.HOME)
    } else if (category.toLowerCase() === "search") {
      history.push(RouteMap.SEARCH)
    } else {
      history.push(GetPwaCategoryUrl(category.toLowerCase()))
    }
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <IonList>
          <IonItemGroup>
            {standardCategories
              .filter((x) => x.category !== "HOME")
              .map((cat, i) => (
                <IonItem
                  className="CategoryPageItem"
                  lines="none"
                  key={i}
                  button
                  onClick={() => onPress(cat.value)}
                >
                  <IonIcon className="CategoryPageItemIcon" icon={cat.icon} />
                  {capitalize(cat.category)}
                </IonItem>
              ))}
          </IonItemGroup>
          <IonListHeader>
            <IonLabel>CATEGORIES</IonLabel>
          </IonListHeader>
          <IonItemGroup>
            {categories.map((cat, i) => (
              <IonItem
                className="CategoryPageItem"
                key={i}
                button
                onClick={() => onPress(cat.category)}
              >
                <IonIcon className="CategoryPageItemIcon" icon={cat.icon} />
                {capitalize(cat.category)}
              </IonItem>
            ))}
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default memo(Categories)
