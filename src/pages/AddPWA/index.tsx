import React, { memo, useCallback, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonProgressBar,
} from "@ionic/react"
import { RouteMap } from "../../routes"
import "./styles.css"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { thunkAddPWA } from "../../redux/User/actions"
import SumbitAppForm from "../../components/SumbitAppForm"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useHistory } from "react-router"

const AddPWA: React.FC = () => {
  const history = useHistory()
  const { isLoading, isLoggedIn } = useSelector(
    ({ user: { loading, isLoggedIn } }: ReduxCombinedState) => ({
      isLoading: loading,
      isLoggedIn,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const addApp = useCallback(
    async (
      name: string,
      description: string,
      url: string,
      category: string,
      icon: File,
      screenshots: File[],
      tags: string[]
    ) => {
      dispatch(
        thunkAddPWA(name, description, url, category, icon, screenshots, tags)
      )
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      history.push(RouteMap.LOGIN)
    }
  }, [isLoading, isLoggedIn])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
          <IonTitle>Add PWA</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <SumbitAppForm onSubmit={addApp} />
      </IonContent>
    </IonPage>
  )
}

export default memo(AddPWA)