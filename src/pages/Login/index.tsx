import React, { useState, useEffect, memo, useCallback } from "react"
import { RouteComponentProps, useLocation, useHistory } from "react-router"
import {
  IonPage,
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
  IonSpinner,
} from "@ionic/react"
import {
  setToken,
  setIsLoggedIn,
  loadProfile,
} from "../../data/user/user.actions"
import {
  postLogin,
  postDevice,
  setTokenData,
  setIsLoggedInData,
} from "../../data/dataApi"
import { connect } from "../../data/connect"
import queryString from "query-string"
import { logoGithub } from "ionicons/icons"
import { RouteMap } from "../../routes"
import { useDispatch, useSelector } from "react-redux"
import { thunkLogin } from "../../redux/User/actions"
import { ReduxCombinedState } from "../../redux/RootReducer"
import ReactGA from "react-ga"

const LogIn: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [validationError, setValidationError] = useState(false)
  const location = useLocation()

  const history = useHistory()

  const { isLoading, token } = useSelector(
    ({ user: { loading, token } }: ReduxCombinedState) => ({
      isLoading: loading,
      token: token,
    })
  )
  const dispatch = useDispatch()
  const setToken = useCallback(
    (token: string) => dispatch(setTokenData(token)),
    [dispatch]
  )
  const setIsLoggedin = useCallback(
    (isLoggedIn: boolean) => dispatch(setIsLoggedInData(isLoggedIn)),
    [dispatch]
  )
  const login = useCallback(
    async (username: string, password: string) =>
      dispatch(thunkLogin(username, password)),
    [dispatch]
  )

  useEffect(() => {
    if (location && queryString.parse(location.search).token) {
      const thirdPartyLogin = async () => {
        setToken(queryString.parse(location.search).token as string)
        setIsLoggedin(true)
        const key = localStorage.getItem("push_key")
        const auth = localStorage.getItem("push_auth")
        const endpoint = localStorage.getItem("push_endpoint")
        if (key && auth && endpoint) {
          await postDevice(key, auth, endpoint)
        }
        ReactGA.event({
          category: "github login",
          action: "User logged in with github",
        })
      }
      thirdPartyLogin()
    }
  }, [location])

  useEffect(() => {
    if (token) {
      history.push(RouteMap.PROFILE, { direction: "back" })

      setPassword("")
      setUsername("")
    }
  }, [token])

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    if (!username || username.length < 6) {
      setUsernameError(true)
    }
    if (!password) {
      setPasswordError(true)
    }

    await login(username, password)
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

          <form noValidate onSubmit={onLogin}>
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
              <IonCol size="12" className="primary-input-container">
                <IonLabel position="stacked">Username</IonLabel>
                <IonInput
                  name="username"
                  type="text"
                  // placeholder="Username"
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
              <IonCol size="12" className="primary-input-container">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  name="password"
                  type="password"
                  // placeholder="Password"
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
              <IonCol size="6">
                <IonButton type="submit" expand="block">
                  Log In
                  {isLoading && <IonSpinner />}
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton routerLink="/signup" color="light" expand="block">
                  Signup
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
          <form action="/api/signin/github" method="POST">
            <IonRow>
              <IonCol size="12">
                <IonButton color="github" expand="full" type="submit">
                  Sign In with GitHub <IonIcon icon={logoGithub} />
                </IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default memo(LogIn)
