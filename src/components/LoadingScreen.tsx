import React from "react"
import { IonPage, IonContent, IonImg } from "@ionic/react"

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
  },
  content: {
    height: "100%",
    width: "100%",
  },
  image: {
    display: "block",
    width: 258,
    height: 258,
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
}

const LoadingScreen: React.FC = () => (
  <IonPage style={styles.page}>
    <IonContent style={styles.content}>
      <IonImg
        alt="logo"
        className="fade-in"
        style={styles.image}
        src="assets/icon/logo.png"
      />
    </IonContent>
  </IonPage>
)

export default LoadingScreen
