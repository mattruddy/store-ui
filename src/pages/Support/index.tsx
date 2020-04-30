import React, { useState, memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonButton,
  IonInput,
  IonLabel,
  IonToast,
  IonItem,
} from "@ionic/react"
import { postEmail } from "../../data/dataApi"

const Support: React.FC = () => {
  const [text, setText] = useState<string>()
  const [toastText, setToastText] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", padding: "15px" }}>
            <IonLabel style={{ marginLeft: "30px" }}>Support Request</IonLabel>
          </div>
          <IonTextarea
            style={{ boxShadow: "0 0 3px #ccc", width: "95%" }}
            value={text}
            rows={10}
            placeholder="Please add a message"
            onIonChange={(e) => {
              setText(e.detail.value!)
            }}
          />
          <IonButton
            style={{ width: "95%", marginTop: "15px", borderRadius: "5px" }}
            type="button"
            expand="full"
            onClick={async () => {
              if (!text || text === "") return
              await postEmail(text!)
              setText("")
              setToastText("Sent. You will hear from us shortly")
              setShowToast(true)
            }}
          >
            Submit
          </IonButton>
        </div>
      </IonContent>
      <IonToast
        position="top"
        isOpen={showToast}
        duration={10000}
        message={toastText}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  )
}

export default memo(Support)
