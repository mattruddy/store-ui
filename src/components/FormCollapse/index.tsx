import React, { memo, FormEvent, useState } from "react"
import { Collapse } from "react-collapse"
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
      <IonItem lines="none" button onClick={toggle}>
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
      <Collapse isOpened={isOpen}>{children}</Collapse>
    </>
  )
}

export default memo(FormCollapse)
