import { memo, useState, useCallback } from "react"
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
import {
  dateFormatter,
  mdConverter,
  shareUrl,
  copyStringToClipboard,
} from "../../util"
import { GetPWADetailUrl, getBaseShareUri, getPwaName } from "../../routes"
import { trash, starOutline, starSharp, share, flame } from "ionicons/icons"
import "./styles.css"
import StarsListModal from "../StarsListModal"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { setAlert } from "../../redux/Alerts/actions"

interface ContainerProps {
  devLog: DevLog
  isLinkable: boolean
  isRouted?: boolean
  onLike?: (logId: number) => void
  onDelete?: (logId: number) => void
}

const DevLogCard: React.FC<ContainerProps> = ({
  devLog,
  isLinkable,
  onDelete,
  onLike,
  isRouted = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const shareText = `Check out ${devLog.appName} on Progressive App Store:`

  const dispatch = useDispatch()
  const setCopiedAlert = useCallback(
    (message: string, status: "success" | "fail") =>
      dispatch(
        setAlert({
          message: message,
          timeout: 3000,
          show: true,
          status: status,
        })
      ),
    [dispatch]
  )

  const shareUrlString = `${getBaseShareUri()}/log/${getPwaName(
    devLog.appName
  )}/${devLog.logId}`

  const handleDelete = (e: any) => {
    e.preventDefault()
    onDelete && onDelete(devLog.logId)
  }

  const handleLike = (e: any) => {
    e.preventDefault()
    if (isLoggedIn && onLike) {
      onLike(devLog.logId)
    }
  }

  // @ts-ignore
  const canShareOnMobileDevice = navigator.share ? true : false

  const handleShare = (e: any) => {
    if (canShareOnMobileDevice) {
      shareUrl(shareUrlString, devLog.appName, shareText)
    } else {
      copyStringToClipboard(shareUrlString)
      setCopiedAlert("Copied to Clipboard", "success")
    }
  }

  const { isLoggedIn } = useSelector(
    ({ user: { isLoggedIn } }: ReduxCombinedState) => ({
      isLoggedIn,
    }),
    shallowEqual
  )

  return (
    <>
      <IonCard className="line-around">
        <IonCardHeader
          className="bottom-line-border"
          style={{ padding: "8px" }}
        >
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              style={{ background: "transparent" }}
              onClick={handleLike}
              disabled={!isLoggedIn}
            >
              <IonIcon
                size="small"
                className="sub-color"
                icon={devLog.appLikes.hasRated ? starSharp : starOutline}
              />
            </button>
            <span style={{ paddingLeft: "8px", paddingRight: "8px" }}>
              {devLog.appLikes.ratings && devLog.appLikes.ratings.length}
            </span>
          </div>
          {devLog.canDelete && (
            <button
              style={{ background: "transparent" }}
              onClick={handleDelete}
            >
              <IonIcon size="small" className="sub-color" icon={trash} />
            </button>
          )}
          <button style={{ background: "transparent" }} onClick={handleShare}>
            <IonIcon size="small" className="sub-color" icon={share} />
          </button>
          <div>{dateFormatter(devLog.loggedAt)}</div>
        </div>
      </IonCard>
      {devLog && devLog.appLikes && devLog.appLikes.ratings && (
        <StarsListModal
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
          ratings={devLog.appLikes.ratings}
        />
      )}
    </>
  )
}

export default memo(DevLogCard)
