import React, { useState, memo, useCallback, useEffect } from "react"
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
import { RouteMap } from "../../routes"
import { validEmail } from "../../util/index"
import { useHistory } from "react-router"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkSetEmail } from "../../redux/User/actions"
import { Axios } from "../../redux/Actions"

const Support: React.FC = () => {
  const [text, setText] = useState<string>("")
  const [fromEmail, setFromEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string | undefined>(undefined)
  const [toastText, setToastText] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)
  const history = useHistory()

  const { email } = useSelector(
    ({ user: { email } }: ReduxCombinedState) => ({
      email: email,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const setEmail = useCallback(
    (email: string) => dispatch(thunkSetEmail(email)),
    [dispatch]
  )

  useEffect(() => {
    if (email && validEmail(email) && !email.endsWith("@pwa.com")) {
      setFromEmail(email)
    }
  }, [email])

  const submitSupport = async () => {
    if (!text || !fromEmail || !validEmail(fromEmail)) return

    await (await Axios()).post(`secure/support`, {
      text: text!,
      email: fromEmail,
    })
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
            disabled={!validEmail(fromEmail) || !text}
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

export default memo(Support)
