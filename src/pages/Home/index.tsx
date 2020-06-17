import { IonContent, IonNote, IonPage, useIonViewDidEnter } from "@ionic/react"
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react"
import ReactGA from "react-ga"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { AddToHomeScreen } from "../../components"
import Footer from "../../components/Footer"
import HidingHeader from "../../components/HidingHeader"
import HomeRow from "../../components/HomeRow"
import { useAddToHomescreenPrompt } from "../../hooks/useAddToHomescreenPrompt"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { GetPwaCategoryUrl } from "../../routes"
import "./styles.css"
import { useHidingHeader } from "../../hooks/useHidingHeader"

const Home: React.FC = () => {
  const history = useHistory()
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [hideDecimal, setScrollYCurrent] = useHidingHeader(50)

  const { homeData, isLoading, darkMode } = useSelector(
    ({
      pwas: { home, isPending },
      user: { darkMode },
    }: ReduxCombinedState) => ({
      homeData: home,
      isLoading: isPending,
      darkMode,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const getHomeData = useCallback(() => dispatch(thunkGetHomeData()), [
    dispatch,
  ])
  const setDarkmode = useCallback(
    (active: boolean) => dispatch(thunkSetDarkMode(active)),
    [dispatch]
  )

  useIonViewDidEnter(() => {
    getHomeData()
  })

  useEffect(() => {
    ReactGA.pageview(`Home`)
  }, [])

  const onPress = useCallback(
    (category: string) => history.push(GetPwaCategoryUrl(category)),
    [history]
  )

  const renderHomeList = useMemo(() => {
    return (
      <>
        <HomeRow
          pwas={homeData.topApps}
          title="Top"
          subtitle="Most popular"
          linkTo=""
          onPressCallback={onPress}
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.discoverApps}
          title="Discover"
          subtitle="Currently trending"
          linkTo="trending"
          onPressCallback={onPress}
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.newApps}
          title="New"
          subtitle="Fresh new uploads"
          linkTo="new"
          onPressCallback={onPress}
          isLoading={isLoading}
        />
      </>
    )
  }, [homeData, isLoading, onPress])

  const renderHeader = useMemo(() => {
    return (
      <HidingHeader hideDecimal={hideDecimal}>
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
      </HidingHeader>
    )
  }, [hideDecimal, promptToInstall, prompt])

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
        {renderHomeList}
        <Footer />
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
