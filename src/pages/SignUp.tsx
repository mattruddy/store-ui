import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonLabel, IonInput, IonCol, IonButton, IonText } from '@ionic/react';
import { setToken, setIsLoggedIn } from '../data/user/user.actions';
import { postSignup } from '../data/dataApi';
import { connect } from '../data/connect';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken;
  setIsLoggedIn: typeof setIsLoggedIn;
}

interface StateProps {}

interface SignIn extends OwnProps,  DispatchProps, StateProps {}

const SignUp: React.FC<SignIn> = ({
  setToken: setTokenAction,
  history,
  setIsLoggedIn: setIsLoggedInAction
}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        if(!username) {
          setUsernameError(true);
        }
        if(!password) {
          setPasswordError(true);
        }
        if (!email) {
            setEmailError(true);
        }
    
        if(username && password && email) {
          try {
            const data = await postSignup(
              username,
              password,
              email
            );
            if (!data.token) {
              throw "No Token data!";
            }
            setTokenAction(data.token);
            setIsLoggedInAction(true);
            history.push('/profile');
          } catch (e) {
            console.log(`Error signing up: ${e}`);
          }
        }
      };

    return (
    <IonPage>
        <form noValidate onSubmit={signup}>
            <IonList>
                <IonItem>
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
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                        name="email"
                        type="text"
                        spellCheck={false}
                        value={email}
                        onIonChange={e => {
                            setEmail(e.detail.value!);
                            setEmailError(false)
                        }}
                        required
                    />
                </IonItem>
                {formSubmitted && emailError && 
                <IonText color="danger">
                    <p className="ion-padding-start">
                        Email is required
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
              <IonButton type="submit" expand="block">Create</IonButton>
            </IonCol>
          </IonRow>
        </form>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
    mapDispatchToProps: {
      setToken,
      setIsLoggedIn,
    },
    component: SignUp
  })