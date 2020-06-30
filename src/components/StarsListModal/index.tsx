import React, { memo } from "react"
import {
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react"
import { Rating } from "../../util/types"
import { starOutline } from "ionicons/icons"

interface ContainerProps {
  isOpen: boolean
  onDidDismiss: () => void
  ratings: Rating[]
}

const StarsListModal: React.FC<ContainerProps> = ({
  isOpen,
  onDidDismiss,
  ratings,
}) => {
  return (
    <IonModal swipeToClose={true} isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>
            <IonIcon size="large" icon={starOutline} />
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {ratings.map((rating, idx) => (
            <IonItem
              key={idx}
              disabled={!rating.linkable}
              routerLink={rating.linkable ? `/dev/${rating.from}` : undefined}
              onClick={onDidDismiss}
            >
              {rating.from}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  )
}

export default memo(StarsListModal)
