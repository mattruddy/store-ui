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
import { capitalize, getFormattedDate } from "../../util"
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
    <IonCard className="line-around">
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
          {" "}
          {capitalize(education.degree.toString())} in {education.major} |{" "}
          {getFormattedDate(education.gradDate)}
        </IonCardSubtitle>
        {education.minor && (
          <IonCardSubtitle>Minor - {education.minor}</IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  )
}

export default memo(EducationCard)
