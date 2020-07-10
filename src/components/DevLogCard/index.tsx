import { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonRouterLink,
} from "@ionic/react"
import React from "react"
import { DevLog } from "../../util/types"
import { dateFormatter, mdConverter } from "../../util"
import { GetPWADetailUrl } from "../../routes"
import { trash } from "ionicons/icons"
import "./styles.css"

interface ContainerProps {
  devLog: DevLog
  isLinkable: boolean
  isRouted?: boolean
  onDelete?: (logId: number) => void
}

const DevLogCard: React.FC<ContainerProps> = ({
  devLog,
  isLinkable,
  onDelete,
  isRouted = true,
}) => {
  const handleDelete = (e: any) => {
    e.preventDefault()
    onDelete && onDelete(devLog.logId)
  }

  return (
    <IonCard className="line-around">
      <IonCardHeader className="bottom-line-border" style={{ padding: "8px" }}>
        <IonCardTitle className="DevLogCardTitle">
          <img
            style={{ borderRadius: "6px" }}
            src={devLog.icon}
            height="30px"
            width="30px"
          />
          {isLinkable ? (
            <IonRouterLink
              style={{ paddingLeft: "8px" }}
              routerLink={GetPWADetailUrl(devLog.appName)}
            >
              {devLog.appName}
            </IonRouterLink>
          ) : (
            <span style={{ paddingLeft: "8px" }}>{devLog.appName}</span>
          )}
        </IonCardTitle>
      </IonCardHeader>
      <IonRouterLink
        routerLink={
          isRouted
            ? `/log/${devLog.appName.replace(/ /g, "-")}/${devLog.logId}`
            : undefined
        }
      >
        <IonCardContent>
          <div
            style={{ padding: "16px" }}
            dangerouslySetInnerHTML={{
              __html: mdConverter.makeHtml(devLog.log),
            }}
          />
        </IonCardContent>
      </IonRouterLink>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <div>
          {devLog.canDelete && (
            <button
              style={{ background: "transparent" }}
              onClick={handleDelete}
            >
              <IonIcon size="small" className="sub-color" icon={trash} />
            </button>
          )}
        </div>
        <div>{dateFormatter(devLog.loggedAt)}</div>
      </div>
    </IonCard>
  )
}

export default memo(DevLogCard)
