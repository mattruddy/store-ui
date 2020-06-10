import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButtons,
  IonBackButton,
  IonNote,
  IonTitle,
} from "@ionic/react"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { PWACard } from "../../components"
import { PWA } from "../../util/types"
import { RouteComponentProps, useParams } from "react-router"

import ReactGA from "react-ga"
import { capitalize } from "../../util"
import { categories } from "../../components/CategoryOptions"
import { standardCategories } from "../../components/SideBar"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetPWAs } from "../../redux/PWAs/actions"
import "./styles.css"
import PWACardPlaceholder from "../../components/PWACardPlaceholder"
import HidingHeader from "../../components/HidingHeader"
import { useHidingHeader } from "../../hooks/useHidingHeader"

const PWAs: React.FC<RouteComponentProps> = () => {
  const { category } = useParams()
  const [page, setPage] = useState<number>(0)
  const [cat, setCat] = useState<string>("")
  const [scrollDisabled, setScrollDisabled] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const scrollEl = useRef<HTMLIonInfiniteScrollElement>(null)
  const content = useRef<HTMLIonContentElement>(null)
  const [showHeader, heightPercentage, setScrollYCurrent] = useHidingHeader(50)

  const { pwasSections, isLoading, pwas } = useSelector(
    ({ pwas }: ReduxCombinedState) => ({
      pwasSections: pwas.pwaSections,
      isLoading: pwas.isPending,
      pwas: pwas.pwas,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const getPWAs = useCallback(
    async (page: number, category?: string) =>
      dispatch(thunkGetPWAs(page, category)),
    [dispatch]
  )

  const sectionPwas = useMemo(() => {
    const newpwasSections = pwasSections.filter(
      (section) =>
        section.page <= page &&
        section.category.toLowerCase() ===
          (category ? category : "").toLowerCase()
    )
    if (newpwasSections.length > 0) {
      return newpwasSections
        .flatMap((section) => section.appId)
        .map((id) => pwas.find((i) => i.appId === id) as PWA)
    }
    return undefined
  }, [pwasSections, category, page, pwas])

  useEffect(() => {
    return () => {
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
    reloadPwas(newCat)
    setCat(newCat)
    setScrollDisabled(false)
    ReactGA.pageview(`PWAs ${newCat}`)
    content.current?.scrollToTop && content.current.scrollToTop(0)
  }, [category])

  const loadMorePwas = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    await getPWAs(nextPage, cat && cat !== "" ? cat : undefined)
    setPage(nextPage)
    scrollEl.current && scrollEl.current.complete()
    setLoadingMore(false)
  }

  const reloadPwas = (option?: string) => {
    setPage(0)
    getPWAs(
      0,
      option || option === "" ? option : cat && cat !== "" ? cat : undefined
    )
  }

  const renderPwaList = useMemo(() => {
    if (!isLoading && sectionPwas && sectionPwas.length < 1) {
      return (
        <IonNote className="PWAsEmptyNote">
          No PWAs in the following category
        </IonNote>
      )
    }

    return isLoading && !loadingMore
      ? [...Array(10)].map((_e, i) => (
          <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
            <PWACardPlaceholder />
          </IonCol>
        ))
      : sectionPwas &&
          sectionPwas!.map((pwa, i) => (
            <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
              <PWACard url="/pwa" pwa={pwa} />
            </IonCol>
          ))
  }, [sectionPwas, isLoading, loadingMore])

  const renderHeader = useMemo(
    () => (
      <HidingHeader showHeader={showHeader} heightPrecentage={heightPercentage}>
        <IonButtons className="PWAsBackbutton" slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle>
          {capitalize(
            cat === "" ? "TOP" : cat === "TRENDING" ? "DISCOVER" : cat
          )}
        </IonTitle>
      </HidingHeader>
    ),
    [showHeader, heightPercentage, cat]
  )

  return (
    <IonPage>
      {renderHeader}
      <IonContent
        fullscreen={true}
        className="content"
        scrollEvents={true}
        onIonScroll={(e) => setScrollYCurrent(e.detail.scrollTop)}
        ref={content}
      >
        <IonRow>
          <IonCol className="CardListCol">
            <IonRow>{renderPwaList}</IonRow>
          </IonCol>
        </IonRow>
        {cat !== undefined && cat.toLowerCase() !== "trending" && (
          <IonInfiniteScroll
            ref={scrollEl}
            threshold="100px"
            disabled={scrollDisabled}
            onIonInfinite={loadMorePwas}
          >
            <IonInfiniteScrollContent />
          </IonInfiniteScroll>
        )}
      </IonContent>
    </IonPage>
  )
}

export default PWAs
