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
import { dateFormatterMMMYYYY, mdConverter } from "../../util"
import "./styles.css"

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
    <IonCard className="JobCard bottom-line-border">
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
          <p>{`${job.title}`}</p>
          <p>{`${dateFormatterMMMYYYY(job.start)} - ${
            job.end ? dateFormatterMMMYYYY(job.end) : "present"
          }`}</p>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {job.description && (
          <div
            dangerouslySetInnerHTML={{
              __html: mdConverter.makeHtml(job.description),
            }}
          ></div>
        )}
      </IonCardContent>
    </IonCard>
  )
}

export default memo(JobCard)
