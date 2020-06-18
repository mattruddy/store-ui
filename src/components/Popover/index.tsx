import React, { memo, Fragment, MouseEvent, useState } from "react"
import { IonPopover, IonButton, IonIcon, IonList, IonItem } from "@ionic/react"
import "./styles.css"

type PopoverItem = {
  name: string
  icon: string
  action: () => any
}

interface ContainerProps {
  showPopover: boolean
  setShowPopover: (show: boolean) => void
  icon: string
  items: PopoverItem[]
}

const Popover: React.FC<ContainerProps> = ({
  showPopover,
  setShowPopover,
  icon,
  items,
}) => {
  const [ev, setEv] = useState<any>()

  const onDismiss = () => {
    setShowPopover(false)
  }

  const onShow = (e: MouseEvent) => {
    setShowPopover(true)
    setEv(e.nativeEvent)
  }

  return (
    <Fragment>
      <IonPopover isOpen={showPopover} onDidDismiss={onDismiss} event={ev}>
        <IonList>
          {items.map((item, idx) => (
            <IonItem
              className="CategoryPageItem"
              key={idx}
              button={true}
              onClick={() => {
                item.action()
                onDismiss()
              }}
            >
              <IonIcon
                className="CategoryPageItemIcon"
                size="small"
                icon={item.icon}
              />
              {item.name}
            </IonItem>
          ))}
        </IonList>
      </IonPopover>
      <IonButton onClick={onShow}>
        <IonIcon className="PopoverButton" icon={icon} />
      </IonButton>
    </Fragment>
  )
}

export default memo(Popover)
