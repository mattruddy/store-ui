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
} from "@ionic/react"
import { categories } from "../../components/CategoryOptions"
import { capitalize } from "../../util"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl } from "../../routes"
import "./styles.css"

const Categories: React.FC = () => {
  const history = useHistory()

  const onPress = (category: string) =>
    history.replace(GetPwaCategoryUrl(category.toLowerCase()))

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Categories</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
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
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default memo(Categories)
