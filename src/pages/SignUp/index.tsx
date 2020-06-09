import React, { useState, memo, useEffect, useCallback } from "react"
import { useHistory } from "react-router"
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonImg,
  IonSpinner,
} from "@ionic/react"
import { RouteMap } from "../../routes"
import ReactGA from "react-ga"
import { thunkSignUp } from "../../redux/User/actions"
import { useDispatch, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [isValidPW, setIsValidPW] = useState<boolean>(false)
  const history = useHistory()

  const { isLoading, token } = useSelector(
    ({ user: { loading, token } }: ReduxCombinedState) => ({
      isLoading: loading,
      token: token,
    })
  )

  const dispatch = useDispatch()
  const signUp = useCallback(
    (username: string, password: string, email: string) =>
      dispatch(thunkSignUp(username, password, email)),
    [dispatch]
  )

  useEffect(() => {
    if (token) {
      history.push(RouteMap.PROFILE, { direction: "back" })

      setPassword("")
      setUsername("")
      setEmail("")
    }
  }, [token])

  const checkValidPW = (pw: string) => {
    return RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      "g"
    ).test(pw)
  }

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    if (!username) {
      setUsernameError(true)
    }
    if (!password) {
      setPasswordError(true)
    }
    if (!email) {
      setEmailError(true)
    }

    if (username && password && email) {
      await signUp(username, password, email)
    }
  }

  useEffect(() => {
    ReactGA.pageview("Sign Up")
  }, [])

  return (
    <IonPage>
      <IonContent className="content">
        <IonGrid fixed>
          <IonRow style={{ display: "flex", justifyContent: "center" }}>
            <IonImg
              alt="logo"
              style={{ height: "100px", width: "100px" }}
              src="/assets/icon/logo.png"
            />
          </IonRow>

          <form noValidate onSubmit={onSignup}>
            <IonRow>
              <IonCol size="12" className="primary-input-container">
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  name="username"
                  type="text"
                  spellCheck={false}
                  maxlength={30}
                  value={username}
                  onIonChange={(e) => {
                    setUsername(e.detail.value!)
                    setUsernameError(false)
                  }}
                  required
                />
              </IonCol>
              {formSubmitted && usernameError && (
                <IonText color="danger">
                  <p className="ion-padding-start">Username is required</p>
                </IonText>
              )}
              <IonCol size="12" className="primary-input-container">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  name="email"
                  type="text"
                  spellCheck={false}
                  maxlength={50}
                  value={email}
                  onIonChange={(e) => {
                    setEmail(e.detail.value!)
                    setEmailError(false)
                  }}
                  required
                />
              </IonCol>
              {formSubmitted && emailError && (
                <IonText color="danger">
                  <p className="ion-padding-start">Email is required</p>
                </IonText>
              )}
              <IonCol size="12" className="primary-input-container">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  name="password"
                  type="password"
                  spellCheck={false}
                  value={password}
                  maxlength={80}
                  onIonChange={(e) => {
                    setPassword(e.detail.value!)
                    setPasswordError(false)
                    setIsValidPW(checkValidPW(e.detail.value as string))
                  }}
                  required
                />
              </IonCol>
              {password !== "" && !isValidPW && (
                <IonText color="danger">
                  <p className="ion-padding-start">
                    Password must contain a capital letter, number and symbol
                  </p>
                </IonText>
              )}
              {formSubmitted && passwordError && (
                <IonText color="danger">
                  <p className="ion-padding-start">Password is required</p>
                </IonText>
              )}
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonButton type="submit" expand="block" disabled={!isValidPW}>
                  Sign Up
                  {isLoading && <IonSpinner />}
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default memo(SignUp)
