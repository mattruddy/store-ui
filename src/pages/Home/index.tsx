import {
  IonContent,
  IonNote,
  IonPage,
  useIonViewDidEnter,
  IonToggle,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonRow,
  IonCol,
} from "@ionic/react"
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react"
import ReactGA from "react-ga"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AddToHomeScreen } from "../../components"
import Footer from "../../components/Footer"
import HidingHeader from "../../components/HidingHeader"
import HomeRow from "../../components/HomeRow"
import { useAddToHomescreenPrompt } from "../../hooks/useAddToHomescreenPrompt"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { ReduxCombinedState } from "../../redux/RootReducer"
import "./styles.css"
import { useHidingHeader } from "../../hooks/useHidingHeader"
import {
  thunkSetDarkMode,
  thunkLoadFollowedDevLogs,
} from "../../redux/User/actions"
import { sunny, moon } from "ionicons/icons"
import DevLogCard from "../../components/DevLogCard"

const Home: React.FC = () => {
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [hideDecimal, setScrollYCurrent] = useHidingHeader(50)

  const { homeData, isLoading, darkMode, isLoggedIn, devLogs } = useSelector(
    ({
      pwas: { home, isPending },
      user: { darkMode, isLoggedIn, devLogs },
    }: ReduxCombinedState) => ({
      homeData: home,
      isLoading: isPending,
      darkMode,
      isLoggedIn,
      devLogs,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const getHomeData = useCallback(() => dispatch(thunkGetHomeData()), [
    dispatch,
  ])
  const getFollowedDevLogs = useCallback(
    () => dispatch(thunkLoadFollowedDevLogs()),
    [dispatch]
  )

  const setDarkMode = useCallback(
    (active: boolean) => dispatch(thunkSetDarkMode(active)),
    [dispatch]
  )

  useIonViewDidEnter(() => {
    getHomeData()
    if (isLoggedIn) {
      getFollowedDevLogs()
    }
  })

  useEffect(() => {
    ReactGA.pageview(`Home`)
  }, [])

  const renderHomeList = useMemo(() => {
    return (
      <>
        <HomeRow
          pwas={homeData.featuredApps}
          title="Featured"
          subtitle="Editors Choice"
          linkTo="featured"
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.discoverApps}
          title="Discover"
          subtitle="Currently trending"
          linkTo="trending"
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.topApps}
          title="Top"
          subtitle="Most popular"
          linkTo=""
          isLoading={isLoading}
        />
      </>
    )
  }, [homeData, isLoading])

  const renderHeader = useMemo(() => {
    return (
      <HidingHeader hideDecimal={hideDecimal}>
        <div className="HomeHeader">
          <div>
            <h1>Progressive App Store</h1>
            <IonNote>Build, Discover and Share Applications</IonNote>
          </div>
          <div>
            <IonButtons>
              <IonButton onClick={(e) => setDarkMode(!darkMode)}>
                <IonIcon icon={darkMode ? moon : sunny} />
              </IonButton>
              <AddToHomeScreen
                prompt={prompt}
                promptToInstall={promptToInstall}
              />
            </IonButtons>
          </div>
        </div>
      </HidingHeader>
    )
  }, [hideDecimal, promptToInstall, prompt, darkMode])

  const renderDevLogs = useMemo(() => {
    return devLogs.map((log, idx) => <DevLogCard key={idx} devLog={log} />)
  }, [devLogs])

  return (
    <IonPage>
      {renderHeader}

      <IonContent
        fullscreen={true}
        scrollEvents={true}
        onIonScroll={(e) => setScrollYCurrent(e.detail.scrollTop)}
        className="content"
        ref={content}
      >
        <IonRow>
          <IonCol size="12" sizeMd="6">{renderDevLogs}</IonCol>
          <IonCol size="12" sizeMd="6">{renderHomeList}</IonCol>
        </IonRow>
        <Footer />
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
