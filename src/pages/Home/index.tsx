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
import { getSearchApp, getHome } from "../../data/dataApi"
import { PWA, HomePWAs } from "../../util/types"
import { RouteComponentProps, useHistory } from "react-router"
import "./styles.css"
import { GetPwaCategoryUrl } from "../../routes"
import { closeOutline, search, home } from "ionicons/icons"
import Footer from "../../components/Footer"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { connect as reduxConnector, ConnectedProps } from "react-redux"

const mapStateToProps = ({ pwas }: ReduxCombinedState): StateProps => ({
  homeData: pwas.home,
  isLoading: pwas.isPending,
})

const mapDispatchToProps = { thunkGetHomeData }

interface StateProps {
  homeData: HomePWAs
  isLoading: boolean
}

const connector = reduxConnector(mapStateToProps, mapDispatchToProps)
type PropsFromRedux = ConnectedProps<typeof connector>

type HomeProps = RouteComponentProps & PropsFromRedux

const Home: React.FC<HomeProps> = ({
  homeData,
  thunkGetHomeData: getHomeData,
  isLoading,
}) => {
  const history = useHistory()
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const content = useRef<any>()

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
          {homeData.topApps.map((topApp, i) => (
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
          {homeData.newApps.map((newApp, i) => (
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
          {homeData.discoverApps.map((discoverApp, i) => (
            <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
              <PWACard url="/pwa" pwa={discoverApp} />
            </IonCol>
          ))}
        </IonRow>
      </>
    )
  }, [homeData])

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

export default connector(Home)
