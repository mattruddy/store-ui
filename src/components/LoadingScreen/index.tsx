import React from "react"
import { IonPage, IonContent, IonImg, IonLabel } from "@ionic/react"
import "./styles.css"

const LoadingScreen: React.FC = () => (
  <IonPage>
    <IonContent color="primary" className="LoadingScreenContent">
      <div className="LoadingScreenContainer fade-in">
        <IonImg
          alt="logo"
          className="LoadingScreenImage"
          src="assets/icon/logo.png"
        />
        <IonLabel className="LoadingScreenLabel">PWA Store</IonLabel>
      </div>
    </IonContent>
  </IonPage>
)

export default LoadingScreen
