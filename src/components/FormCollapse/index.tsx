import React, { memo, useState } from "react"
import { IonItem, IonIcon } from "@ionic/react"
import { addCircleOutline, closeCircleOutline } from "ionicons/icons"
import "./styles.css"

interface ContainerProps {
  title: string
  subtitle?: string
  children: any
}

const FormCollapse: React.FC<ContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <IonItem lines="none" button onClick={toggle} detail={false}>
        {!isOpen ? (
          <>
            <IonIcon
              size="large"
              className="CollapseButtonIcon"
              icon={addCircleOutline}
            />{" "}
            <div>
              <h3 style={{ margin: "0px" }}>{title}</h3>
              <span className="sub-color" style={{ fontSize: "14px" }}>
                {subtitle}
              </span>
            </div>
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
