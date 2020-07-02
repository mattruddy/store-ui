import {
  IonCard,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonCardHeader,
} from "@ionic/react"
import React, { memo, useState, useEffect } from "react"
import FormItem from "../FormItem"
import ReactMde from "react-mde"
import { mdConverter } from "../../util"

interface AppOfDayProps {
  url: string
  icon: string
  info: string
  title: string
  edit?: boolean
  onSubmit?: (title: string, info: string) => void
}

const AppOfDay: React.FC<AppOfDayProps> = ({
  url,
  icon,
  info,
  title,
  edit = false,
  onSubmit,
}) => {
  const [localTitle, setLocalTitle] = useState<string>("")
  const [localInfo, setLocalInfo] = useState<string>("")
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

  useEffect(() => {
    if (info) {
      setLocalInfo(info)
    }
    setLocalTitle(title)
  }, [title, info])

  return (
    <IonCard routerLink={edit ? undefined : url} className="line-around">
      {edit && (
        <IonCardHeader>
          <IonCardTitle>App of the Day</IonCardTitle>
        </IonCardHeader>
      )}
      <IonRow>
        <IonCol size="3">
          <img src={icon} style={{ padding: "16px", width: "75%" }} />
        </IonCol>
        <IonCol size="9">
          {edit ? (
            <FormItem
              name="Title"
              type="text"
              spellCheck={false}
              value={localTitle}
              maxLength={25}
              onChange={(e) => setLocalTitle(e.detail!.value)}
            />
          ) : (
            <IonCardTitle style={{ padding: "16px" }}>{title}</IonCardTitle>
          )}
          {edit ? (
            <FormItem name="Info">
              <div
                style={{
                  width: "100%",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
              >
                <ReactMde
                  classes={{ grip: "hide", toolbar: "mde-toolbar" }}
                  value={localInfo}
                  onChange={setLocalInfo}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(md) =>
                    Promise.resolve(mdConverter.makeHtml(localInfo))
                  }
                />
              </div>
            </FormItem>
          ) : (
            <IonCardSubtitle style={{ padding: "16px" }}>
              {info}
            </IonCardSubtitle>
          )}
        </IonCol>
      </IonRow>
      {edit && (
        <IonRow>
          <IonButton
            fill="clear"
            onClick={() => {
              if (onSubmit) onSubmit(localTitle, localInfo)
            }}
          >
            Submit
          </IonButton>
        </IonRow>
      )}
    </IonCard>
  )
}

export default memo(AppOfDay)
