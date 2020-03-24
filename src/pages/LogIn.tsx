import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonPage, IonList, IonItem, IonRow, IonLabel, IonInput, IonCol, IonButton, IonText, IonContent } from '@ionic/react';
import { setToken, setIsLoggedIn } from '../data/user/user.actions';
import { postLogin } from '../data/dataApi';
import { connect } from '../data/connect';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken;
  setIsLoggedIn: typeof setIsLoggedIn;
}

interface StateProps {}

interface LoginProps extends OwnProps,  DispatchProps, StateProps {}

const LogIn: React.FC<LoginProps> = ({
  setToken: setTokenAction,
  history,
  setIsLoggedIn: setIsLoggedInAction
}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [validationError, setValidationError] = useState(false);

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        if(!username) {
          setUsernameError(true);
        }
        if(!password) {
          setPasswordError(true);
        }
    
        if(username && password) {
          try {
            const data = await postLogin(
              username,
              password,
            );
            console.log(data);
            if (!data.token) {
              throw "No Token data!";
            }
            setTokenAction(data.token);
            setIsLoggedInAction(true);
            setValidationError(false);
            history.push('/profile');
          } catch (e) {
            if (e.message === "Invalid Credentials") {
                setValidationError(true);
            }
          }
        }
      };

    return (
    <IonPage>
        <IonContent style={{ overflow: 'hidden'}}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <img style={{height: '100px', width: '100px'}} src='/assets/icon/logo.png' />
        </div>
        <form noValidate onSubmit={signup}>
            <IonList>
                <IonItem>
                    {formSubmitted && validationError && <IonText color="danger">
                        <p className="ion-padding-start">
                        Username or Password incorrect
                        </p>
                    </IonText>}
                    <IonLabel position="stacked">Username</IonLabel>
                    <IonInput
                        name="username"
                        type="text"
                        spellCheck={false}
                        value={username}
                        onIonChange={e => {
                            setUsername(e.detail.value!)
                            setUsernameError(false)
                        }}
                        required
                    />
                </IonItem>
                {formSubmitted && usernameError && 
                <IonText color="danger">
                    <p className="ion-padding-start">
                        Username is required
                    </p>
                </IonText>}
                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                        name="password"
                        type="password"
                        spellCheck={false}
                        value={password}
                        onIonChange={e => {
                            setPassword(e.detail.value!)
                            setPasswordError(false)
                        }}
                        required
                    />
                </IonItem>
                {formSubmitted && passwordError && 
                <IonText color="danger">
                    <p className="ion-padding-start">
                        Password is required
                    </p>
                </IonText>}
            </IonList>
            <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Log In</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        </form>
        </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
    mapDispatchToProps: {
      setToken,
      setIsLoggedIn
    },
    component: LogIn
  })