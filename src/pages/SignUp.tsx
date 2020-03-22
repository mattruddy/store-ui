import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonLabel, IonInput, IonCol, IonButton, IonText } from '@ionic/react';
import { setToken } from '../data/user/user.actions';
import { postSignup } from '../data/dataApi';
import { connect } from '../data/connect';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken;
}

interface StateProps {}

const SignUp: React.FC = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [tokenError, setTokenError] = useState(false);

    const signup = async (e: React.FormEvent) => {
        console.log(username)
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
            console.log(data);
            if (!data.token) {
              setTokenError(true);
              throw "No Token data!";
            }
            setToken(data.token);
            //history.push('/tabs/home', {direction: 'none'});
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
                    <IonLabel>Username</IonLabel>
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
                    <IonLabel>Email</IonLabel>
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
                    <IonLabel>Password</IonLabel>
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
    },
    component: SignUp
  })