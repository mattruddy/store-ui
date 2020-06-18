import React, { memo } from "react"
import "./styles.css"
import { IonCol, IonRow } from "@ionic/react"
import { TotalAppData } from ".."

interface ContainerProps {
  data: TotalAppData
}

const DataBox: React.FC<ContainerProps> = ({ data }) => {
  return (
    <IonCol className="DataLeftCol" size="12">
      <IonRow>
        <IonCol className="DataRowLeft" size="6">
          <IonRow className="DataRow">
            <IonCol className="DataCol">Installs</IonCol>
            <IonCol className="DataCol text-color">{data.totalInstalls}</IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="6">
          <IonRow className="DataRow">
            <IonCol className="DataCol">Page Views</IonCol>
            <IonCol className="DataCol text-color">
              {data.totalPageViews}
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonCol>
  )
}

export default memo(DataBox)
