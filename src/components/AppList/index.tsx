import { PWA } from "../../util/types"
import React, { memo } from "react"
import {
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonReorderGroup,
  IonReorder,
} from "@ionic/react"
import { add, trash } from "ionicons/icons"

interface AppListProps {
  pwas: PWA[]
  deleteCallback?: (pwa: PWA) => void
  addCallback?: (pwa: PWA) => void
  doReorder?: (from: number, to: number) => void
}

const AppList: React.FC<AppListProps> = ({
  pwas,
  deleteCallback,
  addCallback,
  doReorder,
}) => {
  return (
    <IonRow>
      <IonCol>
        <IonReorderGroup
          disabled={!doReorder}
          onIonItemReorder={(e) => {
            if (doReorder) {
              doReorder(e.detail.from, e.detail.to)
              e.detail.complete()
            }
          }}
        >
          {pwas.map((n, i) => (
            <IonItem key={i} lines="inset">
              <img
                slot="start"
                style={{ padding: "8px" }}
                height="50px"
                width="50px"
                src={n.icon}
              />
              <IonLabel>{n.name}</IonLabel>
              <IonButtons slot="end">
                <>
                  {addCallback && (
                    <IonButton fill="clear" onClick={(e) => addCallback(n)}>
                      <IonIcon icon={add} />
                    </IonButton>
                  )}
                  {deleteCallback && (
                    <IonButton
                      fill="clear"
                      onClick={(e) => {
                        deleteCallback(n)
                      }}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  )}
                </>
              </IonButtons>
              {doReorder && <IonReorder />}
            </IonItem>
          ))}
        </IonReorderGroup>
      </IonCol>
    </IonRow>
  )
}

export default memo(AppList)
