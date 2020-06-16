import React, { memo, useMemo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonButtons,
  IonCol,
  IonBackButton,
  useIonViewDidEnter,
} from "@ionic/react"
import { useParams } from "react-router"
import { PWACard } from "../../components"
import "./styles.css"
import ProfileCard from "../../components/ProfileCard"
import { mdConverter } from "../../util"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetDev } from "../../redux/PWAs/actions"
import ReactGA from "react-ga"

const Developer: React.FC = () => {
  const { username } = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)

  const { profile, isLoading } = useSelector(
    ({ pwas: { devs, isDevPending } }: ReduxCombinedState) => ({
      profile: devs.find((x) => x.username === username),
      isLoading: isDevPending,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const addDev = useCallback(
    async (username: string) => dispatch(thunkGetDev(username)),
    [dispatch]
  )

  useEffect(() => {
    ;(async () => {
      if (!notFound) {
        if (!profile && username) {
          const fetchedDev = await addDev(username)
          if (!fetchedDev) {
            setNotFound(true)
          }
        }
      }
    })()
  }, [notFound, profile, username])

  const renderProfileSection = useMemo(
    () =>
      profile && (
        <ProfileCard
          gitHub={profile.github}
          linkedIn={profile.linkedIn}
          twitter={profile.twitter}
          avatar={profile.avatar}
          isLoading={isLoading}
        />
      ),
    [profile, isLoading]
  )

  useIonViewDidEnter(() => {
    if (username) {
      ReactGA.pageview(username)
    } else {
      console.warn("page loaded before param view found.")
    }
  }, [])

  const renderAboutSection = useMemo(() => {
    return (
      <p
        style={{ margin: "0", padding: "16px" }}
        dangerouslySetInnerHTML={{
          __html: mdConverter.makeHtml(profile?.about!),
        }}
      />
    )
  }, [profile?.about])

  const renderAppsSection = useMemo(() => {
    return (
      profile &&
      profile.apps.map((pwa, idx) => <PWACard key={idx} pwa={pwa} url="/pwa" />)
    )
  }, [profile?.apps])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>
            <h1 style={{ fontSize: "20px", margin: "0" }}>{username}</h1>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonRow>
          <IonCol className="ProfileCardCol" size="12" sizeMd="3">
            {renderProfileSection}
          </IonCol>
          <IonCol size="12" sizeMd="9">
            {renderAboutSection}
          </IonCol>
          <IonCol className="ProfileCardCol" size="12" sizeMd="3">
            {renderAppsSection}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Developer)
