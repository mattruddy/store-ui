import React, {
  useState,
  memo,
  useEffect,
  useMemo,
  FormEvent,
} from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonButtons,
} from "@ionic/react"
import { useHistory } from "react-router"
import { StoreNotification } from "../../util/types"
import { useSelector, shallowEqual } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { Axios } from "../../redux/Actions"
import { FormItem } from "../../components"
import ReactMde from "react-mde"
import { mdConverter } from "../../util"
import NotifyList from "../../components/NotifyList"
import { RouteMap } from "../../routes"
import {
  newspaper,
  ellipsisVertical,
  medal,
  notifications as notifyIcon,
} from "ionicons/icons"
import Popover from "../../components/Popover"

const AdminNotify: React.FC = () => {
  const [notifications, setNotifications] = useState<StoreNotification[]>([])
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [showPopover, setShowPopover] = useState(false)

  const history = useHistory()

  const { isLoggedIn, loading } = useSelector(
    ({ user: { isLoggedIn, notLoading } }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
      loading: notLoading,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (isLoggedIn) {
      ;(async () => {
        const resp = await (await Axios()).get(`admin/notify`)
        if (resp.data) {
          setNotifications(resp.data)
        }
      })()
    }
  }, [isLoggedIn])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const resp = await (await Axios()).post(`admin/notify`, {
      subject: subject,
      body: body,
    })
    if (resp.status === 200) {
      setNotifications((curr) => [resp.data, ...curr])
    }
  }

  const onDelete = async (id: number) => {
    const resp = await (await Axios()).delete(`admin/notify/${id}`)
    if (resp.status === 200) {
      setNotifications((curr) => [...curr.filter((x) => x.id !== id)])
    }
  }

  const renderPopover = useMemo(
    () => (
      <Popover
        showPopover={showPopover}
        setShowPopover={setShowPopover}
        icon={ellipsisVertical}
        items={[
          {
            name: "Notifications",
            action: () => history.push(RouteMap.ADMIN_NOTIFY),
            icon: notifyIcon,
          },
          {
            name: "App Approval",
            action: () => history.push(RouteMap.ADMIN_PWAS),
            icon: newspaper,
          },
          {
            name: "App Feature",
            action: () => history.push(RouteMap.ADMIN_FEATURE),
            icon: medal,
          },
        ]}
      />
    ),
    [showPopover]
  )

  const renderCreate = useMemo(
    () => (
      <>
        <IonCard className="line-around">
          <IonCardHeader>
            <IonTitle>Create Notification</IonTitle>
          </IonCardHeader>
          <IonRow>
            <IonCol size="12">
              <form onSubmit={onSubmit}>
                <FormItem
                  name="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.detail.value)}
                  showError={false}
                  errorMessage=""
                />
                <FormItem name="Description" showError={false} errorMessage="">
                  <div style={{ width: "100%", paddingTop: "16px" }}>
                    <ReactMde
                      classes={{ grip: "hide", toolbar: "mde-toolbar" }}
                      value={body}
                      onChange={setBody}
                      selectedTab={selectedTab}
                      onTabChange={setSelectedTab}
                      generateMarkdownPreview={(md) =>
                        Promise.resolve(mdConverter.makeHtml(body!))
                      }
                    />
                  </div>
                </FormItem>
                <IonButton fill="clear" type="submit">
                  Submit
                </IonButton>
              </form>
            </IonCol>
          </IonRow>
        </IonCard>
      </>
    ),
    [notifications, isLoggedIn, body, subject, selectedTab]
  )

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Notifications Admin</IonTitle>
          <IonButtons slot="end">{renderPopover}</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoggedIn && notifications ? (
          <>
            {renderCreate}
            <IonCard className="line-around">
              <IonCardHeader>
                <IonTitle>Notifications</IonTitle>
              </IonCardHeader>
              <NotifyList
                loading={loading}
                notifications={notifications}
                deleteCallback={onDelete}
              />
            </IonCard>
          </>
        ) : (
          <IonRow>
            <IonCol sizeMd="12">
              <h1 className="HomeCardsHeader">Page Not Found</h1>
            </IonCol>
          </IonRow>
        )}
      </IonContent>
    </IonPage>
  )
}

export default memo(AdminNotify)
