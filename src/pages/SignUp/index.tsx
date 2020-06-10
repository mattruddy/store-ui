import React, { useState, memo, useEffect, useCallback } from "react"
import { useHistory } from "react-router"
import {
  IonContent,
  IonPage,
  IonButton,
  IonImg,
  IonHeader,
  IonToolbar,
} from "@ionic/react"
import { RouteMap } from "../../routes"
import ReactGA from "react-ga"
import { thunkSignUp } from "../../redux/User/actions"
import { useDispatch, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { checkValidPW } from "../../util"
import FormItem from "../../components/FormItem"

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [hasSubmit, setHasSubmit] = useState<boolean>(false)
  const history = useHistory()

  const { token } = useSelector(({ user: { token } }: ReduxCombinedState) => ({
    token: token,
  }))

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
      setHasSubmit(false)
    }
  }, [token])

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasSubmit(true)
    if (username && email && checkValidPW(password)) {
      signUp(username, password, email)
    }
  }

  useEffect(() => {
    ReactGA.pageview("Sign Up")
  }, [])

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
        <form onSubmit={onSignup}>
          <FormItem
            name="Username"
            type="text"
            spellCheck={false}
            maxLength={50}
            value={username}
            onChange={(e) => setUsername(e.detail!.value)}
            errorMessage="Username is required"
            showError={hasSubmit && username === ""}
          />
          <FormItem
            name="Email"
            type="text"
            spellCheck={false}
            maxLength={50}
            value={email}
            onChange={(e) => setEmail(e.detail.value!)}
            errorMessage="Email is required"
            showError={hasSubmit && email === ""}
          />
          <FormItem
            name="Password"
            type="password"
            spellCheck={false}
            value={password}
            maxLength={80}
            onChange={(e) => setPassword(e.detail.value!)}
            errorMessage="Min 8 characters, include capital letter, number and special character"
            showError={password !== "" && !checkValidPW(password)}
          />
          <IonButton
            className="button-no-shadow"
            type="submit"
            expand="block"
            disabled={!checkValidPW(password)}
          >
            Sign Up
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default memo(SignUp)
