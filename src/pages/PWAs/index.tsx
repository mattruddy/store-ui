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
  IonList,
  IonItem,
  IonListHeader,
  IonItemGroup,
  IonLabel,
  IonIcon,
  IonButton,
} from "@ionic/react"
import { CategoryOptions, DebouncedSearch, PWACard } from "../../components"
import { getPWAs, getSearchApp } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { RouteComponentProps, withRouter } from "react-router"
import { setLoading } from "../../data/user/user.actions"
import { categories } from "../../components/CategoryOptions"
import "./styles.css"
import ReactGA from "react-ga"
import { capitalize } from "../../util"
import {
  search,
  flashlightOutline,
  ribbonOutline,
  calendarOutline,
} from "ionicons/icons"

const standardCategories = [
  { category: "TOP", value: "", icon: ribbonOutline },
  { category: "NEW", value: "NEW", icon: calendarOutline },
  { category: "DISCOVER", value: "TRENDING", icon: flashlightOutline },
]

const PWAs: React.FC<RouteComponentProps> = ({ history }) => {
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
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
          sizeMd="4"
          sizeLg="3"
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
          <IonButtons slot="end">
            <div className="select">
              {pwaSearchValue === "" && (
                <CategoryOptions onPress={onPress} initValue={cat} />
              )}
            </div>
            <IonButton slot="end">
              <IonIcon icon={search} />
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
      <IonContent class="content" ref={content} forceOverscroll={true}>
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
        {/* <IonGrid fixed> */}
        {isLoading && <IonProgressBar type="indeterminate" />}
        <IonRow>
          <IonCol size="2" class="side">
            <IonRow>
              <IonCol>
                <IonList class="list">
                  <IonItemGroup>
                    {standardCategories.map((cat, i) => (
                      <IonItem
                        key={i}
                        class="item-top"
                        lines="none"
                        button={true}
                        onClick={() => onPress(cat.value)}
                      >
                        <IonIcon class="icon-top" icon={cat.icon} />
                        {capitalize(cat.category)}
                      </IonItem>
                    ))}
                  </IonItemGroup>
                  <IonListHeader>
                    <IonLabel>CATEGORIES</IonLabel>
                  </IonListHeader>
                  <IonItemGroup>
                    {categories.map((cat, i) => (
                      <IonItem
                        class="item"
                        key={i}
                        button={true}
                        lines="none"
                        onClick={() => onPress(cat.category)}
                      >
                        <IonIcon class="icon" icon={cat.icon} />
                        {capitalize(cat.category)}
                      </IonItem>
                    ))}
                  </IonItemGroup>
                </IonList>
              </IonCol>
            </IonRow>
          </IonCol>
          <IonCol>
            <IonRow>
              <IonCol class="search-mobile">
                <DebouncedSearch onChangeCallback={handleOnSearchChange} />
              </IonCol>
            </IonRow>
            {pwaSearchValue === "" && (
              <IonSegment
                class="seg"
                value={cat}
                onIonChange={(e) => {
                  setCat(e.detail.value!)
                }}
              >
                <IonSegmentButton class="seg-button" value="TRENDING">
                  Discover
                </IonSegmentButton>
                <IonSegmentButton class="seg-button" value="">
                  Top
                </IonSegmentButton>
                <IonSegmentButton class="seg-button" value="NEW">
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
            threshold="1000px"
            onIonInfinite={loadMorePwas}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        )}
        {/* </IonGrid> */}
      </IonContent>
    </IonPage>
  )
}

export default withRouter(memo(PWAs))
