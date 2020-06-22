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
  IonTextarea,
} from "@ionic/react"
import { FormItem } from "../../components"
import ImageUploader from "react-images-upload"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkCreateProfile } from "../../redux/User/actions"
import { validProfileLink, mdConverter } from "../../util"
import ReactMde from "react-mde"
import "react-mde/lib/styles/css/react-mde-all.css"
import "./styles.css"
import ReactGA from "react-ga"

const Settings: React.FC = () => {
  const [fullName, setFullName] = useState<string>("")
  const [gitHub, setGitHub] = useState<string>("")
  const [linkedIn, setLinkedIn] = useState<string>("")
  const [twitter, setTwitter] = useState<string>("")
  const [showEmail, setShowEmail] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [location, setLocation] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const [about, setAbout] = useState<string>("")
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [updateEmail, setUpdateEmail] = useState<string>("")

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
      updateHeader: string | undefined,
      updateLocation: string | undefined,
      updateFullName: string | undefined,
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
          updateHeader,
          updateLocation,
          updateFullName,
          updateAvatar
        )
      )
    },
    [dispatch]
  )

  useEffect(() => {
    ReactGA.pageview(`settings`)
  }, [])

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
      setLocation(profile.location)
      setFullName(profile.fullName)
      setHeader(profile.header)
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
      header,
      location,
      fullName,
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
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <div className="SettingsAvatarContainer">
          <img
            className="SettingsAvatar icon line-around"
            src={
              profile && profile.avatar
                ? profile.avatar
                : "assets/icon/apple-touch-icon.png"
            }
          />
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
            name="Full Name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.detail!.value)}
            showError={false}
            maxLength={30}
            errorMessage=""
          />
          <FormItem
            name="GitHub"
            value={gitHub}
            onChange={(e) => setGitHub(e.detail.value)}
            showError={gitHub ? !validProfileLink(gitHub, "github") : false}
            errorMessage="Invalid GitHub Link"
            maxLength={100}
          />
          <FormItem
            name="LinkedIn"
            value={linkedIn}
            onChange={(e) => setLinkedIn(e.detail.value)}
            showError={
              linkedIn ? !validProfileLink(linkedIn, "linkedin") : false
            }
            errorMessage="Invalid LinkedIn Link"
            maxLength={100}
          />
          <FormItem
            name="Twitter"
            value={twitter}
            onChange={(e) => setTwitter(e.detail.value)}
            showError={twitter ? !validProfileLink(twitter, "twitter") : false}
            errorMessage="Invalid Twitter Link"
            maxLength={100}
          />
          <FormItem
            name="Email"
            value={updateEmail}
            onChange={(e) => setUpdateEmail(e.detail.value)}
            showError={false}
            errorMessage=""
            maxLength={50}
          />
          <FormItem name="Display Email?" showError={false} errorMessage="">
            <IonCheckbox
              checked={showEmail}
              onIonChange={(e) => setShowEmail(e.detail.checked)}
            />
          </FormItem>
          <FormItem
            name="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.detail.value)}
            maxLength={50}
            showError={false}
            errorMessage=""
          />
          <FormItem name="Header (optional)" showError={false} errorMessage="">
            <IonTextarea
              value={header}
              onIonChange={(e) => setHeader(e.detail.value!)}
              maxlength={200}
              spellCheck={true}
            />
          </FormItem>
          <FormItem
            name="This is your section to add what ever you want in markdown"
            showError={about?.trim() === ""}
            errorMessage="About section is required"
          >
            <div style={{ width: "100%", paddingTop: "16px" }}>
              <ReactMde
                value={about}
                onChange={setAbout}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(md) =>
                  Promise.resolve(mdConverter.makeHtml(about!))
                }
              />
            </div>
          </FormItem>
          <IonButton
            style={{ margin: "16px" }}
            disabled={!about || about?.trim() === ""}
            expand="block"
            fill="outline"
            type="submit"
            color="dark"
          >
            Update
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default memo(Settings)
