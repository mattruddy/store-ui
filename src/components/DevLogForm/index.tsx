import { memo, useState, FormEvent, useEffect } from "react"
import { IonSelect, IonSelectOption, IonButton } from "@ionic/react"
import React from "react"
import FormCollapse from "../FormCollapse"
import { FormItem } from ".."
import ReactMde, { TextAreaProps } from "react-mde"
import { PWA } from "../../util/types"
import { mdConverter } from "../../util"

interface ContainerProps {
  apps: PWA[]
  onSubmit: (log: string, appId: number) => void
  status: "success" | "fail" | undefined
}

const DevLogForm: React.FC<ContainerProps> = ({ apps, onSubmit, status }) => {
  const [log, setLog] = useState<string>("")
  const [appId, setAppId] = useState<number>()
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

  useEffect(() => {
    if (status === "success") {
      setLog("")
      setAppId(undefined)
    }
  }, [status])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (log && appId) {
      onSubmit(log, appId)
    }
  }

  return (
    <FormCollapse title="Create DevLog" subtitle="Log app progress for followers to track">
      <form onSubmit={handleSubmit}>
        <FormItem name="Choose App">
          <IonSelect
            value={appId}
            onIonChange={(e) => setAppId(e.detail.value!)}
          >
            {apps.map((app, idx) => (
              <IonSelectOption key={idx} value={app.appId}>
                {app.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </FormItem>
        <FormItem name="Log">
          <div
            style={{ width: "100%", paddingTop: "16px", paddingBottom: "16px" }}
          >
            <ReactMde
              classes={{ grip: "hide", toolbar: "mde-toolbar" }}
              value={log}
              onChange={(s: string) => setLog(s)}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(md) =>
                Promise.resolve(mdConverter.makeHtml(log!))
              }
              childProps={{
                textArea: {
                  maxLength: 1500,
                  placeholder: "Whats new with your app and its development?",
                },
              }}
            />
          </div>
        </FormItem>
        <IonButton
          disabled={!log || !appId}
          fill="outline"
          color="dark"
          expand="block"
          type="submit"
        >
          Add DevLog
        </IonButton>
      </form>
    </FormCollapse>
  )
}

export default memo(DevLogForm)
