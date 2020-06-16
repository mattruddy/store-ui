import React, { useEffect, memo, useMemo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonButtons,
  IonCol,
  IonBackButton,
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWACard } from "../../components"
import { RouteMap } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import "./styles.css"
import ProfileCard from "../../components/ProfileCard"

const Developer: React.FC = () => {
  const history = useHistory()

  const {} = useSelector(({}: ReduxCombinedState) => ({}), shallowEqual)

  const dispatch = useDispatch()

  const renderAppsSections: JSX.Element = useMemo(() => <IonRow></IonRow>, [])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{"username"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonRow>
          <IonCol className="ProfileCardCol" size="12" sizeMd="3">
            {/* <ProfileCard profile={profile} email={email} /> */}
          </IonCol>
          <IonCol size="12" sizeMd="9">
            {renderAppsSections}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Developer)
