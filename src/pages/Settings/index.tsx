import React, { memo, useState } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
} from "@ionic/react"
import { FormItem } from "../../components"
import ImageUploader from "react-images-upload"

const Settings: React.FC = () => {
  const [gitHub, setGitHub] = useState<string>()
  const [linkedIn, setLinkedIn] = useState<string>()
  const [twitter, setTwitter] = useState<string>()
  const [avatar, setAvatar] = useState<File>()
  const [newEmail, setNewEmail] = useState<string>()

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <form>
          <FormItem name="Avatar" showError={false} errorMessage="">
            <ImageUploader
              fileContainerStyle={{
                boxShadow: "none",
                background: "inherit",
                padding: "0",
              }}
              withPreview={true}
              withLabel={false}
              singleImage={true}
              withIcon={false}
              buttonText="Choose Avatar"
              onChange={(files: File[]) => setAvatar(files[0])}
              imgExtension={[".jpg", ".png", ".jpeg"]}
              maxFileSize={5242880}
            />
          </FormItem>
          <FormItem
            name="GitHub"
            value={gitHub}
            onChange={(e) => setGitHub(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={256}
          />
          <FormItem
            name="LinkedIn"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={256}
          />
          <FormItem
            name="Twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={256}
          />
          <FormItem
            name="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={256}
          />
          <IonButton disabled={!gitHub && !linkedIn && !twitter} fill="outline">
            Update
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default memo(Settings)
