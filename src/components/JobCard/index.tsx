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
import { Job } from "../../util/types"
import { trash } from "ionicons/icons"
import { dateFormatterMMMYYYY } from "../../util"

interface ContainerProps {
  job: Job
  onDelete?: (id: number) => void
}

const JobCard: React.FC<ContainerProps> = ({ job, onDelete }) => {
  const handleDelete = (e: any) => {
    e.preventDefault()
    onDelete && onDelete(job.id)
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
        <IonCardTitle>{job.company}</IonCardTitle>
        <IonCardSubtitle>
          {`${job.title} | ${dateFormatterMMMYYYY(job.start)} - ${
            job.end ? dateFormatterMMMYYYY(job.end) : "present"
          }`}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  )
}

export default memo(JobCard)
