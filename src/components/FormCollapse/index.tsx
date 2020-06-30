import React, { memo, useState } from "react"
import { IonItem, IonIcon } from "@ionic/react"
import { addCircleOutline, closeCircleOutline } from "ionicons/icons"
import "./styles.css"

interface ContainerProps {
  title: string
  children: any
}

const FormCollapse: React.FC<ContainerProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <IonItem lines="none" button onClick={toggle} detail={false}>
        {!isOpen ? (
          <>
            <IonIcon className="CollapseButtonIcon" icon={addCircleOutline} />{" "}
            {title}
          </>
        ) : (
          <>
            <IonIcon className="CollapseButtonIcon" icon={closeCircleOutline} />{" "}
            Close
          </>
        )}
      </IonItem>
      <div className={isOpen ? "" : "hide"}>{children}</div>
    </>
  )
}

export default memo(FormCollapse)
