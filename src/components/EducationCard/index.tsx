import React, { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonFabButton,
  IonIcon,
} from "@ionic/react"
import { Education } from "../../util/types"
import { capitalize, dateFormatterMMMYYYY } from "../../util"
import { trash } from "ionicons/icons"
import "./styles.css"

interface ContainerProps {
  education: Education
  onDelete?: (id: number) => void
}

const EducationCard: React.FC<ContainerProps> = ({ education, onDelete }) => {
  const handleDelete = (e: any) => {
    e.preventDefault()
    onDelete && onDelete(education.id)
  }

  return (
    <IonCard className="EducationCard bottom-line-border">
      <IonCardHeader>
        {onDelete && (
          <IonFabButton
            className="CardFabButton"
            size="small"
            onClick={handleDelete}
          >
            <IonIcon color="danger" icon={trash} />
          </IonFabButton>
        )}
        <IonCardTitle>{education.school}</IonCardTitle>
        <IonCardSubtitle>
          <p>
            <strong>{capitalize(education.degree.toString())}</strong> in{" "}
            {education.major}
          </p>
          {education.minor && <p>Minor - {education.minor}</p>}
          <p>{dateFormatterMMMYYYY(education.gradDate)}</p>
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  )
}

export default memo(EducationCard)
