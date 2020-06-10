import React, { useState, useEffect, memo, useCallback } from "react"
import { useLocation, useHistory } from "react-router"
import {
  IonPage,
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonHeader,
  IonToolbar,
  IonRow,
  IonCol,
} from "@ionic/react"
import queryString from "query-string"
import { logoGithub } from "ionicons/icons"
import { RouteMap } from "../../routes"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { thunkLogin, thunkThirdPartyLogin } from "../../redux/User/actions"
import { ReduxCombinedState } from "../../redux/RootReducer"
import FormItem from "../../components/FormItem"

const LogIn: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const location = useLocation()
  const history = useHistory()

  const { isLoading, token } = useSelector(
    ({ user: { loading, token } }: ReduxCombinedState) => ({
      isLoading: loading,
      token: token,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const setThirdPartyLogin = useCallback(
    (token: string) => dispatch(thunkThirdPartyLogin(token)),
    [dispatch]
  )

  const login = useCallback(
    async (username: string, password: string) =>
      dispatch(thunkLogin(username, password)),
    [dispatch]
  )

  useEffect(() => {
    if (!isLoading && location && queryString.parse(location.search).token) {
      const thirdPartyLogin = async () => {
        setThirdPartyLogin(queryString.parse(location.search).token as string)
      }
      thirdPartyLogin()
    }
  }, [location, isLoading])

  useEffect(() => {
    if (token) {
      history.push(RouteMap.PROFILE, { direction: "back" })
      setPassword("")
      setUsername("")
    }
  }, [token])

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    if (username && password) {
      login(username, password)
    }
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="center">
            <IonImg
              className="main-logo-size"
              alt="logo"
              src="/assets/icon/logo.png"
            />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <form noValidate onSubmit={onLogin}>
          <FormItem
            name="Username"
            type="text"
            spellCheck={false}
            maxLength={30}
            value={username}
            onChange={(e) => setUsername(e.detail.value!)}
            errorMessage="Username is required"
            showError={formSubmitted && username === ""}
          />
          <FormItem
            name="Password"
            type="password"
            spellCheck={false}
            maxLength={80}
            value={password}
            onChange={(e) => setPassword(e.detail.value!)}
            errorMessage="Password is required"
            showError={formSubmitted && password === ""}
          />
          <IonRow>
            <IonCol>
              <IonButton
                className="button-no-shadow"
                type="submit"
                expand="block"
                disabled={username === "" || password === ""}
              >
                Log In
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                className="button-no-shadow button-border"
                routerLink="/signup"
                color="light"
                expand="block"
              >
                Signup
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
        <form action="/api/signin/github" method="POST">
          <IonButton
            className="button-no-shadow button-border"
            color="github"
            expand="full"
            type="submit"
          >
            Sign In with GitHub <IonIcon icon={logoGithub} />
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default memo(LogIn)
