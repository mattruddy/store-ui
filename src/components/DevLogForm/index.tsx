import { memo, useState, FormEvent, useEffect } from "react"
import { IonSelect, IonSelectOption, IonButton } from "@ionic/react"
import React from "react"
import FormCollapse from "../FormCollapse"
import { FormItem } from ".."
import ReactMde from "react-mde"
import { PWA } from "../../util/types"

interface ContainerProps {
  apps: PWA[]
  onSubmit: (log: string, appId: number) => void
  status: "success" | "fail" | undefined
}

const DevLogForm: React.FC<ContainerProps> = ({ apps, onSubmit, status }) => {
  const [log, setLog] = useState<string>()
  const [appId, setAppId] = useState<number>()

  useEffect(() => {
    if (status === "success") {
      setLog(undefined)
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
    <FormCollapse title="DevLog">
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
        <FormItem name="Dev Log">
          <div style={{ width: "100%", padding: "16px" }}>
            <ReactMde value={log} onChange={(s: string) => setLog(s)} />
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
