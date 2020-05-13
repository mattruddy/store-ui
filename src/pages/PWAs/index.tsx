import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonIcon,
  IonButton,
  IonGrid,
} from "@ionic/react"
import {
  CategoryOptions,
  DebouncedSearch,
  PWACard,
  SideBar,
} from "../../components"
import { getPWAs, getSearchApp } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { RouteComponentProps, useParams } from "react-router"
import { setLoading } from "../../data/user/user.actions"

import "./styles.css"
import ReactGA from "react-ga"
import { capitalize } from "../../util"
import { search, closeOutline } from "ionicons/icons"

const PWAs: React.FC<RouteComponentProps> = () => {
  const { category } = useParams()
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
  const [pwas, setPwas] = useState<PWA[]>([])
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollEl = useRef<any>(undefined)
  const content = useRef<any>()

  useEffect(() => {
    ReactGA.pageview("PWAs Home")
    return () => {
      setPwas([])
      setPage(0)
    }
  }, [])

  useEffect(() => {
    setCat(category?.toUpperCase() || "")
    loadPWAs()
    content.current.scrollToTop()
  }, [category])

  const loadPWAs = async () => {
    setIsLoading(true)
    const resp = await getPWAs(page, cat && cat !== "" ? cat : undefined)

    if (resp && resp.length > 0) {
      setPwas((prev) => prev.concat(resp))
    }
    setIsLoading(false)
  }

  const loadMorePwas = async () => {
    try {
      const nextPage = page + 1
      const nextPwas = await getPWAs(
        nextPage,
        cat && cat !== "" ? cat : undefined
      )
      if (nextPwas) {
        setPwas((prev) => prev.concat(nextPwas))
        setPage(nextPage)
      }
    } finally {
      scrollEl.current.complete()
    }
  }

  const onPress = (option: string) => {
    setCat(option)
    reloadPwas(option)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const reloadPwas = async (option?: string) => {
    try {
      setLoading(true)
      setPwas([])
      setPage(0)
      const resp = await getPWAs(
        0,
        option || option === "" ? option : cat && cat !== "" ? cat : undefined
      )
      setPwas(resp)
    } finally {
      setLoading(false)
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

  const renderPwaList = useMemo(
    () =>
      (pwaSearchValue ? pwaSearchResults : pwas).map((pwa, i) => (
        <IonCol
          key={i}
          size="6"
          sizeMd="4"
          sizeLg="3"
          // sizeXl="3"
        >
          <PWACard url="/pwa" pwa={pwa} />
        </IonCol>
      )),
    [pwas, pwaSearchValue, pwaSearchResults]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header">
          <IonButtons slot="end">
            <div className="select">
              {pwaSearchValue === "" && <CategoryOptions initValue={cat} />}
            </div>
            <IonButton slot="end" onClick={toggleSearch}>
              <IonIcon icon={showSearch ? closeOutline : search} />
            </IonButton>
          </IonButtons>
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
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (event: any) => {
            try {
              await reloadPwas()
            } finally {
              event.detail.complete()
            }
          }}
        >
          <IonRefresherContent />
        </IonRefresher>
        <IonRow>
          <IonProgressBar
            type={isLoading ? "indeterminate" : "determinate"}
            color="primary"
          />
        </IonRow>
        <IonRow>
          <IonCol size="2" className="side">
            <SideBar />
          </IonCol>
          <IonCol className="CardListCol">
            <IonRow>
              <IonCol size="12">
                {showSearch && (
                  <DebouncedSearch onChangeCallback={handleOnSearchChange} />
                )}
              </IonCol>
            </IonRow>
            {pwaSearchValue === "" && (
              <IonSegment
                className="seg"
                value={cat}
                onIonChange={(e) => {
                  setCat(e.detail.value!)
                }}
              >
                <IonSegmentButton className="seg-button" value="TRENDING">
                  Discover
                </IonSegmentButton>
                <IonSegmentButton className="seg-button" value="">
                  Top
                </IonSegmentButton>
                <IonSegmentButton className="seg-button" value="NEW">
                  New
                </IonSegmentButton>
              </IonSegment>
            )}
            <h1
              style={{
                marginLeft: "20px",
              }}
            >
              {capitalize(cat === "" ? "TOP" : cat)}
            </h1>
            <IonRow>{renderPwaList}</IonRow>
          </IonCol>
        </IonRow>

        {cat !== "TRENDING" && (
          <IonInfiniteScroll
            ref={scrollEl}
            threshold="100px"
            onIonInfinite={loadMorePwas}
          >
            <IonInfiniteScrollContent />
          </IonInfiniteScroll>
        )}
      </IonContent>
    </IonPage>
  )
}

export default memo(PWAs)
