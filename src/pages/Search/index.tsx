import React, { useState, useMemo, useCallback } from "react"
import {
  IonContent,
  IonPage,
  IonCol,
  IonRow,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from "@ionic/react"
import { PWACard, DebouncedSearch } from "../../components"
import { PWA } from "../../util/types"
import "./styles.css"
import { Axios } from "../../redux/Actions"

const Search: React.FC = () => {
  const [pwaSearchResults, setPwaSearchResults] = useState<PWA[]>([])

  const handleOnSearchChange = useCallback(async (appName: string) => {
    if (appName) {
      const { data } = await (await Axios()).get(`public/search/${appName}`)
      setPwaSearchResults(data)
    } else {
      setPwaSearchResults([])
    }
  }, [])

  const renderSearchResults = useMemo(() => {
    return pwaSearchResults.map((pwa, i) => (
      <IonCol key={i} sizeXs="6" sizeSm="4" sizeMd="4" sizeLg="3">
        <PWACard url="/pwa" pwa={pwa} />
      </IonCol>
    ))
  }, [pwaSearchResults])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons className="PWAsBackbutton" slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <h1 className="PWAsH1">Search</h1>{" "}
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <DebouncedSearch onChangeCallback={handleOnSearchChange} />
        <IonRow>{renderSearchResults}</IonRow>
      </IonContent>
    </IonPage>
  )
}

export default Search
