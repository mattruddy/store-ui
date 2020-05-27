import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonProgressBar,
  useIonViewDidEnter,
  IonButton,
  IonButtons,
  IonIcon,
  IonNote,
} from "@ionic/react"
import { PWACard, SideBar, DebouncedSearch } from "../../components"
import { getSearchApp } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { RouteComponentProps, useHistory } from "react-router"
import "./styles.css"
import { GetPwaCategoryUrl } from "../../routes"
import { closeOutline, search } from "ionicons/icons"
import Footer from "../../components/Footer"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import PWACardPlaceholder from "../../components/PWACardPlaceholder"

const Home: React.FC<RouteComponentProps> = () => {
  const history = useHistory()
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const content = useRef<any>()

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
    loadHomeApps()
  })

  useEffect(() => {
    ReactGA.pageview(`Home`)
  }, [])

  const loadHomeApps = () => {
    getHomeData()
  }

  const onPress = (category: string) =>
    history.push(GetPwaCategoryUrl(category))

  const toggleSearch = () => {
    const newShowSearch = !showSearch
    setShowSearch(newShowSearch)
    if (newShowSearch) {
      content.current.scrollToTop()
    } else {
      setPwaSearchResults([])
    }
  }

  const handleOnSearchChange = useCallback(async (appName: string) => {
    if (appName) {
      const results = await getSearchApp(appName)
      setPwaSearchResults(results)
    } else {
      setPwaSearchResults([])
    }
  }, [])

  const renderSearchResults = useMemo(() => {
    return pwaSearchResults.map((pwa, i) => (
      <IonCol key={i} sizeXs="6" sizeSm="4" sizeMd="4" sizeLg="3">
        <PWACard url="/pwa" pwa={pwa} />
      </IonCol>
    ))
  }, [pwaSearchResults])

  const renderHomeList = useMemo(() => {
    return (
      <>
        <div className="HomeRowHeader">
          <h1>Top</h1>
          <IonButton className="HomeViewMoreButton" onClick={() => onPress("")}>
            More
          </IonButton>
        </div>
        <IonRow className="HomeRow">
          {isLoading
            ? [...Array(5)].map((_e, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACardPlaceholder />
                </IonCol>
              ))
            : homeData.topApps.map((topApp, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACard url="/pwa" pwa={topApp} />
                </IonCol>
              ))}
        </IonRow>
        <div className="HomeRowHeader">
          <h1>New</h1>
          <IonButton
            className="HomeViewMoreButton"
            onClick={() => onPress("NEW")}
          >
            More
          </IonButton>
        </div>
        <IonRow className="HomeRow">
          {isLoading
            ? [...Array(5)].map((_e, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACardPlaceholder />
                </IonCol>
              ))
            : homeData.newApps.map((newApp, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACard url="/pwa" pwa={newApp} />
                </IonCol>
              ))}
        </IonRow>
        <div className="HomeRowHeader">
          <h1>Discover</h1>
          <IonButton
            className="HomeViewMoreButton"
            onClick={() => onPress("TRENDING")}
          >
            More
          </IonButton>
        </div>
        <IonRow className="HomeRow">
          {isLoading
            ? [...Array(5)].map((_e, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACardPlaceholder />
                </IonCol>
              ))
            : homeData.discoverApps.map((discoverApp, i) => (
                <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                  <PWACard url="/pwa" pwa={discoverApp} />
                </IonCol>
              ))}
        </IonRow>
      </>
    )
  }, [
    homeData.discoverApps,
    homeData.newApps,
    homeData.topApps,
    isLoading,
    onPress,
  ])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header">
          <IonButtons slot="end">
            <IonButton slot="end" onClick={toggleSearch}>
              <IonIcon icon={showSearch ? closeOutline : search} />
            </IonButton>
          </IonButtons>
          <IonTitle>
            <img
              alt="icon"
              style={{ height: 40, width: 40 }}
              src="assets/icon/logo.png"
            />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content" ref={content}>
        <IonRow>
          <IonProgressBar
            type={isLoading ? "indeterminate" : "determinate"}
            color="primary"
          />
        </IonRow>
        <IonRow>
          <SideBar category={"home"} />
          {showSearch && (
            <IonCol>
              <IonRow>
                <DebouncedSearch onChangeCallback={handleOnSearchChange} />
              </IonRow>
              <IonRow>{renderSearchResults}</IonRow>
            </IonCol>
          )}
          {!showSearch && (
            <IonCol sizeMd="8" className="HomeCardListCol">
              <h1 className="HomeCardsHeader">PWA Store</h1>
              <IonNote>Progressive Web App Discovery</IonNote>
              {renderHomeList}
              <Footer />
            </IonCol>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default Home
