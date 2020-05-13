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
} from "@ionic/react"
import {
  CategoryOptions,
  DebouncedSearch,
  PWACard,
  SideBar,
} from "../../components"
import { getPWAs, getSearchApp } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { RouteComponentProps, useParams, useHistory } from "react-router"
import { setLoading } from "../../data/user/user.actions"

import "./styles.css"
import ReactGA from "react-ga"
import { capitalize } from "../../util"
import { search, closeOutline } from "ionicons/icons"
import { categories } from "../../components/CategoryOptions"
import { standardCategories } from "../../components/SideBar"

const PWAs: React.FC<RouteComponentProps> = () => {
  const { category } = useParams()
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
  const [pwas, setPwas] = useState<PWA[]>([])
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)

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
    let newCat = ""
    if (
      category &&
      (categories.find((cat) => cat.category === category.toUpperCase()) ||
        standardCategories.find((cat) => cat.value === category.toUpperCase()))
    ) {
      newCat = category.toUpperCase()
    }
    setCat(newCat)
    reloadPwas(newCat)
    setScrollDisabled(false)
    content.current.scrollToTop()
  }, [category])

  const loadMorePwas = async () => {
    try {
      if (cat !== "TRENDING") {
        const nextPage = page + 1
        const nextPwas = (await getPWAs(
          nextPage,
          cat && cat !== "" ? cat : undefined
        )) as PWA[]
        if (nextPwas && nextPwas.length > 0) {
          setPwas((prev) => prev.concat(nextPwas))
          setPage(nextPage)
        } else {
          setScrollDisabled(true)
        }
      }
    } finally {
      scrollEl.current.complete()
    }
  }

  const toggleSearch = () => {
    const newShowSearch = !showSearch
    setShowSearch(newShowSearch)
    if (newShowSearch) {
      content.current.scrollToTop()
    }
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
        <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
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
          <IonCol size="2.5" className="side">
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
            <h1
              style={{
                marginLeft: "20px",
              }}
            >
              {capitalize(
                cat === "" ? "TOP" : cat === "TRENDING" ? "DISCOVER" : cat
              )}
            </h1>
            <IonRow>{renderPwaList}</IonRow>
          </IonCol>
        </IonRow>
        <IonInfiniteScroll
          ref={scrollEl}
          threshold="100px"
          disabled={scrollDisabled}
          onIonInfinite={loadMorePwas}
        >
          <IonInfiniteScrollContent />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  )
}

export default memo(PWAs)
