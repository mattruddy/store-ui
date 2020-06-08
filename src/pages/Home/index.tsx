import React, { useEffect, useRef, useMemo, useCallback } from "react"
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  useIonViewDidEnter,
  IonNote,
  IonButton,
  IonHeader,
  IonToolbar,
} from "@ionic/react"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl } from "../../routes"
import Footer from "../../components/Footer"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import HomeRow from "../../components/HomeRow"
import "./styles.css"
import { AddToHomeScreen } from "../../components"
import { useAddToHomescreenPrompt } from "../../hooks/useAddToHomescreenPrompt"

const Home: React.FC = () => {
  const history = useHistory()
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()

  const { homeData, isLoading } = useSelector(
    ({ pwas }: ReduxCombinedState) => ({
      homeData: pwas.home,
      isLoading: pwas.isPending,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const getHomeData = useCallback(() => dispatch(thunkGetHomeData()), [
    dispatch,
  ])

  useIonViewDidEnter(() => {
    getHomeData()
  })

  useEffect(() => {
    ReactGA.pageview(`Home`)
  }, [])

  const onPress = (category: string) =>
    history.push(GetPwaCategoryUrl(category))

  const renderHomeList = useMemo(() => {
    return (
      <>
        <HomeRow
          pwas={homeData.topApps}
          title="Top"
          linkTo=""
          onPressCallback={onPress}
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.discoverApps}
          title="Discover"
          linkTo="trending"
          onPressCallback={onPress}
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.newApps}
          title="New"
          linkTo="new"
          onPressCallback={onPress}
          isLoading={isLoading}
        />
      </>
    )
  }, [homeData, isLoading, onPress])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <div className="HomeHeader">
            <div>
              <h1>PWA Store</h1>
              <IonNote>Progressive Web App Discovery</IonNote>
            </div>
            <div>
              <AddToHomeScreen
                prompt={prompt}
                promptToInstall={promptToInstall}
              />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content" ref={content}>
        {renderHomeList}
        <Footer />
      </IonContent>
    </IonPage>
  )
}

export default Home
