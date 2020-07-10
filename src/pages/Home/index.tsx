import {
  IonContent,
  IonNote,
  IonPage,
  useIonViewDidEnter,
  IonButtons,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
} from "@ionic/react"
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react"
import ReactGA from "react-ga"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AddToHomeScreen } from "../../components"
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
  thunkAddDevLog,
  thunkRemoveDevLog,
  thunkAddLogLike,
} from "../../redux/User/actions"
import { sunny, moon } from "ionicons/icons"
import DevLogCard from "../../components/DevLogCard"
import DevLogForm from "../../components/DevLogForm"

const Home: React.FC = () => {
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [hideDecimal, setScrollYCurrent] = useHidingHeader(50)

  const {
    homeData,
    isLoading,
    darkMode,
    isLoggedIn,
    devLogs,
    pwas,
    status,
  } = useSelector(
    ({
      pwas: { home, isPending },
      user: { darkMode, isLoggedIn, devLogs, pwas },
      alerts: { status },
    }: ReduxCombinedState) => ({
      homeData: home,
      isLoading: isPending,
      darkMode,
      isLoggedIn,
      devLogs,
      pwas,
      status,
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
  const createDevLog = useCallback(
    (log: string, appId: number) => dispatch(thunkAddDevLog(log, appId)),
    [dispatch]
  )
  const deleteDevLog = useCallback(
    (logId: number) => dispatch(thunkRemoveDevLog(logId)),
    [dispatch]
  )
  const likeLog = useCallback(
    (logId: number) => dispatch(thunkAddLogLike(logId)),
    [dispatch]
  )

  useIonViewDidEnter(() => {
    getHomeData()
    if (isLoggedIn) {
      getFollowedDevLogs()
    }
  }, [isLoggedIn])

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
    return devLogs.length > 0 ? (
      devLogs.map((log, idx) => (
        <DevLogCard
          key={idx}
          devLog={log}
          isLinkable={true}
          onDelete={deleteDevLog}
          onLike={likeLog}
        />
      ))
    ) : (
      <IonNote style={{ padding: "16px" }}>No DevLogs</IonNote>
    )
  }, [devLogs, pwas])

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
          {isLoggedIn && (
            <IonCol size="12">
              <DevLogForm onSubmit={createDevLog} apps={pwas} status={status} />
            </IonCol>
          )}
          <IonCol size="12" sizeMd={isLoggedIn ? "7" : "12"}>
            {isLoggedIn && renderDevLogs}
          </IonCol>
          <IonCol size="12" sizeMd={isLoggedIn ? "5" : "12"}>
            {renderHomeList}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
