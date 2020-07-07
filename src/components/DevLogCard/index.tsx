import { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonFabButton,
  IonIcon,
  IonRouterLink,
} from "@ionic/react"
import React from "react"
import { DevLog } from "../../util/types"
import { dateFormatter, mdConverter } from "../../util"
import { GetPWADetailUrl } from "../../routes"
import { trash } from "ionicons/icons"

interface ContainerProps {
  devLog: DevLog
  onDelete: (logId: number) => void
}

const DevLogCard: React.FC<ContainerProps> = ({ devLog, onDelete }) => {
  const handleDelete = (e: any) => {
    e.preventDefault()
    onDelete(devLog.logId)
  }

  return (
    <IonCard className="line-around">
      <IonCardHeader>
        {devLog.canDelete && (
          <IonFabButton
            className="CardFabButton"
            style={{ zIndex: "100000" }}
            size="small"
            onClick={handleDelete}
          >
            <IonIcon color="danger" icon={trash} />
          </IonFabButton>
        )}
        <IonCardTitle>
          <img src={devLog.icon} height="30px" width="30px" />
          <IonRouterLink
            style={{ paddingLeft: "8px" }}
            routerLink={GetPWADetailUrl(devLog.appName)}
          >
            {devLog.appName}
          </IonRouterLink>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div
          dangerouslySetInnerHTML={{ __html: mdConverter.makeHtml(devLog.log) }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {dateFormatter(devLog.loggedAt)}
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DevLogCard)
