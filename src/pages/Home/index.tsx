import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  useCallback,
} from "react"
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
import { getHome, getSearchApp } from "../../data/dataApi"
import { PWA, HomePWAs } from "../../util/types"
import { RouteComponentProps, useParams, useHistory } from "react-router"
import "./styles.css"
import { RouteMap, GetPwaCategoryUrl } from "../../routes"
import { closeOutline, search } from "ionicons/icons"

const Home: React.FC<RouteComponentProps> = () => {
  const history = useHistory()
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [homeResult, setHomeResult] = useState<HomePWAs>()
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const content = useRef<any>()

  useIonViewDidEnter(() => {
    loadHomeApps()
  })

  const loadHomeApps = async () => {
    setHomeResult(await getHome())
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
    setPwaSearchValue(appName)
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
          {homeResult?.topApps.map((topApp, i) => (
            <IonCol key={i} sizeXs="8" sizeSm="4" sizeMd="5" sizeLg="4">
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
          {homeResult?.newApps.map((newApp, i) => (
            <IonCol key={i} sizeXs="8" sizeSm="4" sizeMd="5" sizeLg="4">
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
          {homeResult?.topApps.map((discoverApp, i) => (
            <IonCol key={i} sizeXs="8" sizeSm="4" sizeMd="5" sizeLg="4">
              <PWACard url="/pwa" pwa={discoverApp} />
            </IonCol>
          ))}
        </IonRow>
      </>
    )
  }, [homeResult])

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
          <SideBar />
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
              <IonNote>
                Largest online platform for Progressive Web Apps
              </IonNote>
              {renderHomeList}
            </IonCol>
          )}
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
