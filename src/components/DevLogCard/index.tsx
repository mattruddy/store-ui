import { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
} from "@ionic/react"
import React from "react"
import { DevLog } from "../../util/types"
import { dateFormatter } from "../../util"

interface ContainerProps {
  devLog: DevLog
}

const DevLogCard: React.FC<ContainerProps> = ({ devLog }) => {
  return (
    <IonCard className="line-around">
      <IonCardHeader>
        <IonCardTitle>
          <img src={devLog.icon} height="30px" width="30px" />
          {devLog.appName}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div>{devLog.log}</div>
        <div>{dateFormatter(devLog.loggedAt)}</div>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DevLogCard)
