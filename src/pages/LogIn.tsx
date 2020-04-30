import React, { useState, useEffect } from "react"
import { RouteComponentProps, useLocation } from "react-router"
import {
  IonPage,
  IonList,
  IonItem,
  IonRow,
  IonLabel,
  IonInput,
  IonCol,
  IonButton,
  IonText,
  IonContent,
  IonToast,
  IonIcon,
  IonGrid,
  IonImg,
} from "@ionic/react"
import { setToken, setIsLoggedIn } from "../data/user/user.actions"
import { postLogin, postDevice } from "../data/dataApi"
import { connect } from "../data/connect"
import queryString from "query-string"
import { logoGithub } from "ionicons/icons"

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken
  setIsLoggedIn: typeof setIsLoggedIn
}

interface StateProps {}

interface LoginProps extends OwnProps, DispatchProps, StateProps {}

const LogIn: React.FC<LoginProps> = ({
  setToken: setTokenAction,
  history,
  setIsLoggedIn: setIsLoggedInAction,
}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const [toastMessage, setToastMessage] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)
  const location = useLocation()

  useEffect(() => {
    if (location && queryString.parse(location.search).token) {
      const thirdPartyLogin = async () => {
        setTokenAction(queryString.parse(location.search).token as string)
        setIsLoggedInAction(true)
        const key = localStorage.getItem("push_key")
        const auth = localStorage.getItem("push_auth")
        const endpoint = localStorage.getItem("push_endpoint")
        if (key && auth && endpoint) {
          await postDevice(key, auth, endpoint)
        }
        history.push("/profile", { direction: "back" })
      }
      thirdPartyLogin()
    }
  }, [location])

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    if (!username || username.length < 6) {
      setUsernameError(true)
    }
    if (!password) {
      setPasswordError(true)
    }

    if (username && password) {
      try {
        const data = await postLogin(username, password)
        if (!data.token) {
          throw "No Token data!"
        }
        setTokenAction(data.token)
        setIsLoggedInAction(true)
        setValidationError(false)
        setToastMessage("Success")
        setShowToast(true)
        if (username === "mattruddy") {
          localStorage.setItem("me", username)
        }
        history.push("/profile")
      } catch (e) {
        if (e.message === "Invalid Credentials") {
          setValidationError(true)
        }
      }
    }
  }

  return (
    <IonPage>
      <IonContent style={{ overflow: "hidden" }}>
        <IonGrid fixed>
          <IonRow style={{ display: "flex", justifyContent: "center" }}>
            <IonImg
              alt="logo"
              style={{ height: "100px", width: "100px" }}
              src="/assets/icon/logo.png"
            />
          </IonRow>

          <form noValidate onSubmit={signup}>
            <IonRow>
              {formSubmitted && validationError && (
                <IonCol size="12">
                  <IonText color="danger">
                    <p className="ion-padding-start">
                      Username or Password incorrect
                    </p>
                  </IonText>
                </IonCol>
              )}
              <IonCol size="12">
                <IonLabel position="stacked">Username</IonLabel>
              </IonCol>
              <IonCol size="12">
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
            </IonRow>
            {formSubmitted && usernameError && (
              <IonText color="danger">
                <p className="ion-padding-start">
                  Atleast 6 characters required
                </p>
              </IonText>
            )}
            <IonRow>
              <IonCol size="12" sizeLg="12">
                <IonLabel position="stacked">Password</IonLabel>
              </IonCol>
              <IonCol size="12" sizeLg="12">
                <IonInput
                  name="password"
                  type="password"
                  spellCheck={false}
                  maxlength={80}
                  value={password}
                  onIonChange={(e) => {
                    setPassword(e.detail.value!)
                    setPasswordError(false)
                  }}
                  required
                />
              </IonCol>
            </IonRow>
            {formSubmitted && passwordError && (
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            )}

            <IonRow>
              <IonCol>
                <IonButton type="submit" expand="block">
                  Log In
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/signup" color="light" expand="block">
                  Signup
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
          <form action="/api/signin/github" method="POST">
            <IonButton color="github" expand="full" type="submit">
              Sign In with GitHub <IonIcon icon={logoGithub} />
            </IonButton>
          </form>
        </IonGrid>
      </IonContent>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => {
          setShowToast(false)
          setToastMessage("")
        }}
      />
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setToken,
    setIsLoggedIn,
  },
  component: LogIn,
})
