import React, { useState, memo, useCallback, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonButton,
  IonButtons,
  IonBackButton,
} from "@ionic/react"
import { RouteMap } from "../../routes"
import { validEmail } from "../../util/index"
import { useHistory } from "react-router"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkSetEmail } from "../../redux/User/actions"
import { Axios } from "../../redux/Actions"
import { FormItem } from "../../components"

const Support: React.FC = () => {
  const [text, setText] = useState<string>("")
  const [fromEmail, setFromEmail] = useState<string>("")
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
    history.goBack()
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <FormItem
          name="Email"
          value={fromEmail}
          maxLength={50}
          onChange={(e) => setFromEmail(e.detail.value!)}
          showError={!validEmail(fromEmail)}
          errorMessage={"Invalid email"}
        />
        <FormItem name="Body" showError={false} errorMessage="">
          <IonTextarea
            value={text}
            rows={10}
            maxlength={1000}
            onIonChange={(e) => {
              setText(e.detail.value!)
            }}
          />
        </FormItem>
        <IonButton
          className="button-no-shadow"
          type="button"
          expand="full"
          disabled={!validEmail(fromEmail) || !text}
          onClick={submitSupport}
        >
          Submit
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default memo(Support)
