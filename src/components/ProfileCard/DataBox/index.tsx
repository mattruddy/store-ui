import React, { memo } from "react"
import "./styles.css"
import { IonCol, IonRow, IonCard, IonCardContent } from "@ionic/react"
import { TotalAppData } from "../../../util/types"

interface ContainerProps {
  data: TotalAppData
}

const DataBox: React.FC<ContainerProps> = ({ data }) => {
  return (
    <IonCard className="line-around">
      <IonCardContent>
        <IonRow>
          <IonCol className="DataRowLeft" size="6">
            <span>
              <h3>Installs</h3>
            </span>
            <span className="text-color">{data.totalInstalls}</span>
          </IonCol>
          <IonCol className="DataRowRight" size="6">
            <span>
              <h3>Page Views</h3>
            </span>
            <span className="text-color">{data.totalPageViews}</span>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DataBox)
