import React, { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
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
            {capitalize(education.degree.toString())}s in {education.major}
          </p>
          <p>{dateFormatterMMMYYYY(education.gradDate)}</p>
        </IonCardSubtitle>
        {education.minor && (
          <IonCardSubtitle>Minor - {education.minor}</IonCardSubtitle>
        )}
      </IonCardHeader>
    </IonCard>
  )
}

export default memo(EducationCard)
