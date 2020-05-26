import React, { useState, memo, useEffect } from "react"
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
  IonButtons,
  IonBackButton,
  IonNote,
} from "@ionic/react"
import { postEmail } from "../../data/dataApi"
import { RouteMap } from "../../routes"
import { connect } from "../../data/connect"
import { setEmail } from "../../data/user/user.actions"
import { validEmail } from "../../util/index"
import { RouteComponentProps } from "react-router"

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setEmail: typeof setEmail
}

interface StateProps {
  email?: string
}
interface SupportProps extends OwnProps, DispatchProps, StateProps {}

const Support: React.FC<SupportProps> = ({ history, email, setEmail }) => {
  const [text, setText] = useState<string>("")
  const [fromEmail, setFromEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [toastText, setToastText] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)

  useEffect(() => {
    if (email && validEmail(email) && !email.endsWith("@pwa.com")) {
      setFromEmail(email)
    }
  }, [email])

  const submitSupport = async () => {
    if (!text || !fromEmail || !validEmail(fromEmail)) return
    await postEmail(text!, fromEmail)
    setEmail(fromEmail)
    setText("")
    setToastText("Sent. You will hear from us shortly")
    setShowToast(true)
    history.goBack()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
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
          <IonInput
            style={{ boxShadow: "0 0 3px #ccc", width: "95%" }}
            value={fromEmail}
            placeholder="Email"
            maxlength={50}
            onIonChange={(e) => {
              const newEmail = e.detail.value!
              if (!validEmail(newEmail)) {
                setEmailError("Invalid email")
              } else {
                setEmailError(undefined)
              }
              setFromEmail(newEmail)
            }}
          />
          <IonNote color="danger">{emailError && <p>{emailError}</p>}</IonNote>
          <IonTextarea
            style={{ boxShadow: "0 0 3px #ccc", width: "95%" }}
            value={text}
            rows={10}
            maxlength={1000}
            placeholder="Please add a message"
            onIonChange={(e) => {
              setText(e.detail.value!)
            }}
          />
          <IonButton
            style={{ width: "95%", marginTop: "15px", borderRadius: "5px" }}
            type="button"
            expand="full"
            disabled={(!validEmail(fromEmail) || !text)}
            onClick={submitSupport}
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

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: ({ user: { email } }) => ({
    email,
  }),
  mapDispatchToProps: {
    setEmail,
  },
  component: memo(Support),
})
