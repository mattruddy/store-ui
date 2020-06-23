import React, { useState, useMemo, useCallback, memo } from "react"
import {
  IonContent,
  IonPage,
  IonCol,
  IonRow,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonLabel,
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import { PWACard, DebouncedSearch } from "../../components"
import { PWA, Profile, PublicProfile } from "../../util/types"
import { Axios } from "../../redux/Actions"
import DevCard from "../../components/DevCard"

type SearchSections = "pwas" | "profiles"

const Search: React.FC = () => {
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [profileSearch, setProfileSearch] = useState<PublicProfile[]>([])
  const [section, setSection] = useState<SearchSections>("pwas")

  const handleOnSearchChange = useCallback(async (searchTerm: string) => {
    if (searchTerm) {
      const pwasResp = await (await Axios()).get(`public/search/${searchTerm}`)
      const profileResp = await (await Axios()).get(
        `public/search/dev/${searchTerm}`
      )
      const profileData: PublicProfile[] = profileResp.data
      const pwasData: PWA[] = pwasResp.data

      setPwaSearchResults(pwasData)
      setProfileSearch(profileData)
    } else {
      setPwaSearchResults([])
      setProfileSearch([])
    }
  }, [])

  const renderSearchResults = useMemo(() => {
    return pwaSearchResults.map((pwa, i) => (
      <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
        <PWACard url="/pwa" pwa={pwa} isMyPwa={false} />
      </IonCol>
    ))
  }, [pwaSearchResults])

  const renderProfileResults = useMemo(() => {
    return profileSearch.map((profile, i) => (
      <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
        <DevCard dev={profile} url=""></DevCard>
      </IonCol>
    ))
  }, [profileSearch])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons className="PWAsBackbutton" slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <DebouncedSearch onChangeCallback={handleOnSearchChange} />
        <IonSegment
          value={section}
          onIonChange={(e) => setSection(e.detail.value as SearchSections)}
        >
          <IonSegmentButton value="pwas">Apps</IonSegmentButton>
          <IonSegmentButton value="profiles">Developers</IonSegmentButton>
        </IonSegment>
        <IonRow>
          {section === "pwas" ? renderSearchResults : renderProfileResults}
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Search)
