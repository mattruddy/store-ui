import React, { memo, useMemo, useState } from "react"
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
  useIonViewDidLeave,
} from "@ionic/react"
import { useParams } from "react-router"
import { PWACard } from "../../components"
import "./styles.css"
import ProfileCard from "../../components/ProfileCard"
import { Axios } from "../../redux/Actions"
import { PublicProfile } from "../../util/types"
import { mdConverter } from "../../util"

const Developer: React.FC = () => {
  const [profile, setProfile] = useState<PublicProfile>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const { username } = useParams()

  useIonViewDidEnter(async () => {
    try {
      setIsLoading(true)
      const resp = await (await Axios()).get(`/public/profile/${username}`)
      setProfile(resp.data as PublicProfile)
    } finally {
      setIsLoading(false)
    }
  })

  useIonViewDidLeave(() => {
    setProfile(undefined)
  })

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
