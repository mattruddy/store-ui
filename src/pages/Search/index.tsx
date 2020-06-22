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
} from "@ionic/react"
import { PWACard, DebouncedSearch } from "../../components"
import { PWA, Profile } from "../../util/types"
import { Axios } from "../../redux/Actions"

const Search: React.FC = () => {
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])
  const [profileSearch, setProfileSearch] = useState<Profile[]>([])

  const handleOnSearchChange = useCallback(async (searchTerm: string) => {
    if (searchTerm) {
      const { data } = await (await Axios()).get(`public/search/${searchTerm}`)
      const { profiesData } = await (await Axios()).get(
        `public/search/dev/${searchTerm}`
      )
      setPwaSearchResults(data)
      setProfileSearch(profiesData)
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
      <IonCol>
        <IonLabel>{profile.fullName}</IonLabel>
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
        <IonRow>{renderSearchResults}</IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Search)
