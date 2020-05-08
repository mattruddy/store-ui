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
  IonGrid,
  IonImg,
  IonCard,
} from "@ionic/react"
import { CategoryOptions, DebouncedSearch, PWACard } from "../../components"
import { getPWAs, getSearchApp } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { RouteComponentProps, withRouter } from "react-router"
import { setLoading } from "../../data/user/user.actions"
import "./styles.css"
import ReactGA from "react-ga"

const PWAs: React.FC<RouteComponentProps> = ({ history }) => {
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("TRENDING")
  const [pwas, setPwas] = useState<PWA[]>([])
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scrollEl = useRef<any>(undefined)
  const content = useRef<any>()

  useEffect(() => {
    loadPWAs()
    return () => {
      setPwas([])
      setPage(0)
    }
  }, [])

  useEffect(() => {
    ReactGA.pageview("PWAs Home")
  }, [])

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
          size="12"
          sizeMd="6"
          sizeLg="4"
          // sizeXl="3"
        >
          <PWACard url="/pwa" history={history} pwa={pwa} />
        </IonCol>
      )),
    [pwas, pwaSearchValue, pwaSearchResults]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class="header">
          <IonButtons style={{ paddingRight: "10px" }} slot="end">
            {pwaSearchValue === "" && (
              <CategoryOptions onPress={onPress} initValue={cat} />
            )}
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
      <IonContent class="content" ref={content}>
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
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonGrid fixed>
          {isLoading && <IonProgressBar type="indeterminate" />}
          <IonRow>
            <IonCol>
              <DebouncedSearch onChangeCallback={handleOnSearchChange} />
            </IonCol>
          </IonRow>
          {pwaSearchValue === "" && (
            <IonSegment
              value={cat}
              onIonChange={(e) => {
                setCat(e.detail.value!)
              }}
            >
              <IonSegmentButton class="seg" value="TRENDING">
                Trending
              </IonSegmentButton>
              <IonSegmentButton class="seg" value="NEW">
                New
              </IonSegmentButton>
              <IonSegmentButton class="seg" value="">
                Top
              </IonSegmentButton>
            </IonSegment>
          )}
          <IonRow>{renderPwaList}</IonRow>
          {cat !== "TRENDING" && (
            <IonInfiniteScroll
              ref={scrollEl}
              threshold="1000px"
              onIonInfinite={loadMorePwas}
            >
              <IonInfiniteScrollContent></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default withRouter(memo(PWAs))
