import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
  IonButtons,
  IonIcon,
  IonButton,
  IonBackButton,
  IonNote,
} from "@ionic/react"
import { connect as reduxConnect } from "react-redux"
import { DebouncedSearch, PWACard, SideBar } from "../../components"
import { getSearchApp, getHome } from "../../data/dataApi"
import { PWA, HomePWAs } from "../../util/types"
import { RouteComponentProps, useParams, useHistory } from "react-router"
import { setLoading } from "../../data/user/user.actions"
import { getPWAs } from "../../redux/PWAs/actions"

import "./styles.css"
import ReactGA from "react-ga"
import { capitalize } from "../../util"
import { search, closeOutline } from "ionicons/icons"
import { categories } from "../../components/CategoryOptions"
import { standardCategories } from "../../components/SideBar"
import { RouteMap } from "../../routes"
import { PWAsState } from "../../redux/PWAs/reducer"
//@ts-ignore
const mapStateToProps = ({ PWAs: { items }, isPending }) => ({
  pwas: items,
  isLoading: isPending,
})

const mapDispatchToProps = { getPWAs }

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  getPWAs: typeof getPWAs
}

interface StateProps {
  pwas?: PWA[]
  isLoading: boolean
  username?: string
}

interface PWAsProps extends OwnProps, DispatchProps, StateProps {}

const PWAs: React.FC<PWAsProps> = ({ pwas, getPWAs, isLoading }) => {
  const { category } = useParams()
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
  const [pwaSearchValue, setPwaSearchValue] = useState<string>("")
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [homeResult, setHomeResult] = useState<HomePWAs>()
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)

  const scrollEl = useRef<any>(undefined)
  const content = useRef<any>()

  useEffect(() => {
    return () => {
      setPage(0)
    }
  }, [])

  useEffect(() => {
    try {
      let newCat = ""
      if (
        category &&
        (categories.find((cat) => cat.category === category.toUpperCase()) ||
          standardCategories.find(
            (cat) => cat.value === category.toUpperCase()
          ))
      ) {
        newCat = category.toUpperCase()
      }
      setCat(newCat)
      reloadPwas(newCat)
      setScrollDisabled(false)
      content.current.scrollToTop()
      ReactGA.pageview(`PWAs ${newCat}`)
    } finally {
    }
  }, [category])

  const loadMorePwas = async () => {
    const nextPage = page + 1
    await getPWAs(nextPage, cat && cat !== "" ? cat : undefined)

    scrollEl.current.complete()
  }

  const toggleSearch = () => {
    const newShowSearch = !showSearch
    setShowSearch(newShowSearch)
    if (newShowSearch) {
      content.current.scrollToTop()
    } else {
      setPwaSearchResults([])
    }
  }

  const reloadPwas = async (option?: string) => {
    setPage(0)

    await getPWAs(
      0,
      option || option === "" ? option : cat && cat !== "" ? cat : undefined
    )
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

  const renderPwaList = useMemo(() => {
    const streamPWAs = showSearch ? pwaSearchResults : pwas
    //@ts-ignore
    if (!isLoading && streamPWAs.length < 1) {
      return (
        !showSearch && (
          <IonNote className="PWAsEmptyNote">
            No PWAs in the following category
          </IonNote>
        )
      )
    }
    //@ts-ignore
    return streamPWAs.map((pwa, i) => (
      <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
        <PWACard url="/pwa" pwa={pwa} />
      </IonCol>
    ))
  }, [pwas, pwaSearchValue, pwaSearchResults, showSearch])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header">
          <IonButtons className="PWAsBackButton" slot="start">
            <IonBackButton defaultHref={RouteMap.CATEGORIES} />
          </IonButtons>
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
          <SideBar category={category ? category : ""} />
          <IonCol className="CardListCol">
            {!showSearch ? (
              <h1
                style={{
                  marginLeft: "20px",
                }}
              >
                {capitalize(
                  cat === "" ? "TOP" : cat === "TRENDING" ? "DISCOVER" : cat
                )}
              </h1>
            ) : (
              <IonRow>
                <DebouncedSearch onChangeCallback={handleOnSearchChange} />
              </IonRow>
            )}
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
//@ts-ignore
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PWAs)
