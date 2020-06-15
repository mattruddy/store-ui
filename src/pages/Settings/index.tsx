import React, { memo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonCheckbox,
  IonProgressBar,
} from "@ionic/react"
import { FormItem } from "../../components"
import ImageUploader from "react-images-upload"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkCreateProfile } from "../../redux/User/actions"
import { validProfileLink } from "../../util"
import ReactMde from "react-mde"
import * as Showdown from "showdown"
import "react-mde/lib/styles/css/react-mde-all.css"
import "./styles.css"

const mdConverter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

const Settings: React.FC = () => {
  const [gitHub, setGitHub] = useState<string>()
  const [linkedIn, setLinkedIn] = useState<string>()
  const [twitter, setTwitter] = useState<string>()
  const [showEmail, setShowEmail] = useState<boolean>()
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [about, setAbout] = useState<string>()
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [updateEmail, setUpdateEmail] = useState<string>()

  const { email, profile, isLoading, status } = useSelector(
    ({
      user: { email, profile, loading },
      alerts: { status },
    }: ReduxCombinedState) => ({
      email: email,
      profile: profile,
      status: status,
      isLoading: loading,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const createProfile = useCallback(
    async (
      updateGitHub: string,
      updateLinkedIn: string,
      updateTwitter: string,
      updateShowEmail: boolean,
      updateEmail: string,
      updateAbout: string,
      updateAvatar: File | undefined
    ) => {
      dispatch(
        thunkCreateProfile(
          updateGitHub,
          updateLinkedIn,
          updateTwitter,
          updateShowEmail,
          updateEmail,
          updateAbout,
          updateAvatar
        )
      )
    },
    [dispatch]
  )

  useEffect(() => {
    if (status === "success") {
      setAvatar(undefined)
    }
  }, [status])

  useEffect(() => {
    if (email) {
      setUpdateEmail(email.endsWith("@pwa.com") ? "" : email)
    }
    if (profile) {
      setGitHub(profile.gitHub)
      setLinkedIn(profile.linkedIn)
      setTwitter(profile.twitter)
      setShowEmail(profile.showEmail)
      setAbout(profile.about)
    }
  }, [email, profile])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProfile(
      gitHub!,
      linkedIn!,
      twitter!,
      showEmail!,
      updateEmail!,
      about!,
      avatar
    )
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <div className="SettingsAvatarContainer">
          <img className="icon" src={profile?.avatar} />
        </div>
        <form onSubmit={onSubmit}>
          <FormItem name="Avatar" showError={false} errorMessage="">
            <ImageUploader
              fileContainerStyle={{
                boxShadow: "none",
                background: "inherit",
                padding: "0",
              }}
              withPreview={avatar !== undefined}
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
            showError={gitHub ? !validProfileLink(gitHub, "github") : false}
            errorMessage="Invalid GitHub Link"
            maxLength={256}
          />
          <FormItem
            name="LinkedIn"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.detail.value)}
            showError={
              linkedIn ? !validProfileLink(linkedIn, "linkedin") : false
            }
            errorMessage="Invalid LinkedIn Link"
            maxLength={256}
          />
          <FormItem
            name="Twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.detail.value)}
            showError={twitter ? !validProfileLink(twitter, "twitter") : false}
            errorMessage="Invalid Twitter Link"
            maxLength={256}
          />
          <FormItem
            name="Email"
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={256}
          />
          <FormItem name="Display Email?" showError={false} errorMessage="">
            <IonCheckbox
              checked={showEmail}
              onIonChange={(e) => setShowEmail(e.detail.checked)}
            />
          </FormItem>
          <ReactMde
            value={about}
            onChange={setAbout}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(md) =>
              Promise.resolve(mdConverter.makeHtml(about!))
            }
          />
          <IonButton
            disabled={!gitHub && !linkedIn && !twitter}
            fill="outline"
            type="submit"
          >
            Update
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default memo(Settings)
