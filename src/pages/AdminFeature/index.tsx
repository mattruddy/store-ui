import React, { useState, memo, useEffect, useCallback, useMemo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonRow,
  IonCol,
  IonCard,
  IonButtons,
  IonCardHeader,
  IonCardTitle,
  IonButton,
} from "@ionic/react"
import { PWA } from "../../util/types"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { Axios } from "../../redux/Actions"
import { RouteMap } from "../../routes"
import {
  newspaper,
  ellipsisVertical,
  notifications,
  medal,
} from "ionicons/icons"
import { setAlert } from "../../redux/Alerts/actions"
import AppList from "../../components/AppList"
import Popover from "../../components/Popover"
import { useHistory } from "react-router"
import { DebouncedSearch } from "../../components"
import AppOfDay from "../../components/AppOfDay"

const AdminFeature: React.FC = () => {
  const [featured, setFeatured] = useState<PWA[]>([])
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [showPopover, setShowPopover] = useState(false)
  const [appOfDay, setAppOfDay] = useState<PWA>()
  const history = useHistory()

  const { isLoggedIn } = useSelector(
    ({ user: { isLoggedIn, notLoading } }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
      loading: notLoading,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (isLoggedIn) {
      ;(async () => {
        const resp = await (await Axios()).get(`public/pwas/0/FEATURED`)
        if (resp.data) {
          setFeatured(resp.data)
        }
      })()
    }
  }, [isLoggedIn])

  const dispatch = useDispatch()
  const setFeaturedAlert = useCallback(
    (message: string, status: "success" | "fail") =>
      dispatch(
        setAlert({
          message: message,
          timeout: 3000,
          show: true,
          status: status,
        })
      ),
    [dispatch]
  )

  const handleOnSearchChange = useCallback(async (searchTerm: string) => {
    if (searchTerm) {
      const pwasResp = await (await Axios()).get(`public/search/${searchTerm}`)
      const pwasData: PWA[] = pwasResp.data
      setPwaSearchResults(pwasData)
    } else {
      setPwaSearchResults([])
    }
  }, [])

  const onUpdateFeatured = async (pwas: PWA[]) => {
    const resp = await (await Axios()).put(`admin/feature`, {
      appIds: featured.map((x) => x.appId),
    })
    if (resp.status === 200) {
      setFeaturedAlert("Featured Updated", "success")
    } else {
      setFeaturedAlert(`Updating featured failed: Error ${resp.status}`, "fail")
    }
  }

  const onUpdateAppOfDay = async (
    title: string,
    info: string,
    date: string
  ) => {
    const resp = await (await Axios()).put(`admin/appofday`, {
      appId: appOfDay,
      title: title,
      info: info,
      date: date,
    })
    if (resp.status === 200) {
      setFeaturedAlert("Added App of day", "success")
    } else {
      setFeaturedAlert(`Adding app of day failed: Error ${resp.status}`, "fail")
    }
  }

  const onDelete = async (pwa: PWA) => {
    setFeatured((curr) => [...curr.filter((x) => pwa.name !== x.name)])
  }

  const onAdd = async (pwa: PWA) => {
    setFeatured((curr) => [...curr, pwa])
  }

  const onAppOfDay = async (pwa: PWA) => {
    setAppOfDay(pwa)
  }

  const renderPopover = useMemo(
    () => (
      <Popover
        showPopover={showPopover}
        setShowPopover={setShowPopover}
        icon={ellipsisVertical}
        items={[
          {
            name: "Notifications",
            action: () => history.push(RouteMap.ADMIN_NOTIFY),
            icon: notifications,
          },
          {
            name: "App Approval",
            action: () => history.push(RouteMap.ADMIN_PWAS),
            icon: newspaper,
          },
          {
            name: "App Feature",
            action: () => history.push(RouteMap.ADMIN_FEATURE),
            icon: medal,
          },
        ]}
      />
    ),
    [showPopover]
  )

  const onReorder = async (from: number, to: number) => {
    const data = featured
    data.splice(to, 0, data.splice(from, 1)[0])
    setFeatured(data)
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>App Feature Admin</IonTitle>
          <IonButtons slot="end">{renderPopover}</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoggedIn && featured ? (
          <>
            <IonCard className="line-around">
              <DebouncedSearch onChangeCallback={handleOnSearchChange} />
              <AppList
                pwas={pwaSearchResults}
                addCallback={onAdd}
                starCallback={onAppOfDay}
              />
            </IonCard>
            {appOfDay && (
              <AppOfDay
                title={appOfDay.name}
                info={appOfDay.description}
                icon={appOfDay.icon}
                edit={true}
                onSubmit={onUpdateAppOfDay}
              />
            )}
            <IonCard className="line-around">
              <IonCardHeader>
                <IonCardTitle>Featured</IonCardTitle>
              </IonCardHeader>
              <AppList
                pwas={featured}
                deleteCallback={onDelete}
                doReorder={onReorder}
              />
              <IonButton
                fill="clear"
                onClick={(e) => onUpdateFeatured(featured)}
                disabled={featured.length === 0}
              >
                Update Featured
              </IonButton>
            </IonCard>
          </>
        ) : (
          <IonRow>
            <IonCol sizeMd="12">
              <h1 className="HomeCardsHeader">Page Not Found</h1>
            </IonCol>
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  )
}

export default memo(AdminFeature)
