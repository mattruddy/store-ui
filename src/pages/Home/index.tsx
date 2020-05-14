import React, { useState, useEffect, useRef, useMemo, memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonProgressBar,
} from "@ionic/react"
import { PWACard, SideBar } from "../../components"
import { getHome } from "../../data/dataApi"
import { PWA, HomePWAs } from "../../util/types"
import { RouteComponentProps, useParams, useHistory } from "react-router"

const Home: React.FC<RouteComponentProps> = () => {
  const { category } = useParams()
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
  const [pwas, setPwas] = useState<PWA[]>([])
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [homeResult, setHomeResult] = useState<HomePWAs>()
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollEl = useRef<any>(undefined)
  const content = useRef<any>()

  const loadHomeApps = async () => {
    setHomeResult(await getHome())
  }

  const renderHomeList = useMemo(() => {
    return (
      <>
        <h1>Top</h1>
        <IonRow className="HomeRow">
          {homeResult?.topApps.map((topApp, i) => (
            <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
              <PWACard url="/pwa" pwa={topApp} />
            </IonCol>
          ))}
        </IonRow>
        <IonTitle>New</IonTitle>
        <IonRow className="HomeRow">
          {homeResult?.newApps.map((newApp, i) => (
            <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
              <PWACard url="/pwa" pwa={newApp} />
            </IonCol>
          ))}
        </IonRow>
        <h1>Discover</h1>
        <IonRow className="HomeRow">
          {homeResult?.topApps.map((discoverApp, i) => (
            <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
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
          <IonTitle
            onClick={() => {
              content.current.scrollToTop()
            }}
          >
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
          <IonCol className="CardListCol">
            {cat === "" && <IonRow>{renderHomeList}</IonRow>}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
