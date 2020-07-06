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
    <IonCard className="bottom-line-border">
      <IonCardHeader className="no-padding">
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
        <IonCardSubtitle className="card-sub">
          <p>{`${job.title}`}</p>
          <p>{`${dateFormatterMMMYYYY(job.start)} - ${
            job.end ? dateFormatterMMMYYYY(job.end) : "present"
          }`}</p>
        </IonCardSubtitle>
      </IonCardHeader>
      {job.description && (
        <IonCardContent>
          <div
            style={{ color: "black" }}
            dangerouslySetInnerHTML={{
              __html: mdConverter.makeHtml(job.description),
            }}
          ></div>
        </IonCardContent>
      )}
    </IonCard>
  )
}

export default memo(JobCard)
