import { IonContent, IonNote, IonPage, useIonViewDidEnter } from "@ionic/react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

const Home: React.FC = () => {
  const history = useHistory()
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [scrollYDelta, setScrollYDelta] = useState<number>(0)

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
          subtitle="The fresh new uploads"
          linkTo="new"
          onPressCallback={onPress}
          isLoading={isLoading}
        />
      </>
    )
  }, [homeData, isLoading, onPress])

  return (
    <IonPage>
      <HidingHeader scrollYDelta={scrollYDelta}>
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
      <IonContent
        fullscreen={true}
        scrollEvents={true}
        onIonScroll={(e) => setScrollYDelta(e.detail.deltaY)}
        className="content"
        ref={content}
      >
        {renderHomeList}
        <Footer />
      </IonContent>
    </IonPage>
  )
}

export default Home
