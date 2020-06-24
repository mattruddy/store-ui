import React, { memo, FormEvent, useState, useEffect } from "react"
import {
  IonButton,
  IonCheckbox,
  IonTextarea,
  IonSelect,
  IonSelectOption,
} from "@ionic/react"
import { FormItem } from ".."
import ImageUploader from "react-images-upload"
import ReactMde from "react-mde"
import { Profile, OccupationStatus } from "../../util/types"
import { mdConverter } from "../../util"

interface ContainerProps {
  status: "success" | "fail" | undefined
  profile: Profile | undefined
  email: string | undefined
  onSubmit: (
    gitHub: string,
    showEmail: boolean,
    email: string,
    about: string,
    header: string,
    location: string,
    fullName: string,
    occupationStatus: OccupationStatus,
    avatar: File | undefined
  ) => void
}

const ProfileForm: React.FC<ContainerProps> = ({
  status,
  profile,
  email,
  onSubmit,
}) => {
  const [fullName, setFullName] = useState<string>("")
  const [gitHub, setGitHub] = useState<string>("")
  const [showEmail, setShowEmail] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [location, setLocation] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const [about, setAbout] = useState<string>("")
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [updateEmail, setUpdateEmail] = useState<string>("")
  const [occupationStatus, setOccupationStatus] = useState<OccupationStatus>()

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
      setShowEmail(profile.showEmail)
      setAbout(profile.about)
      setLocation(profile.location)
      setFullName(profile.fullName)
      setHeader(profile.header)
      setOccupationStatus(profile.occupationStatus)
    }
  }, [email, profile])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(
      gitHub,
      showEmail,
      email!,
      about,
      header,
      location,
      fullName,
      occupationStatus!,
      avatar
    )
  }

  return (
    <form onSubmit={handleSubmit}>
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
        showError={false}
        errorMessage="Invalid GitHub Link"
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
      <FormItem name="Occupation Status" showError={false} errorMessage="">
        <IonSelect onIonChange={(e) => setOccupationStatus(e.detail.value)}>
          <IonSelectOption value={OccupationStatus.LOOKING}>
            Looking
          </IonSelectOption>
          <IonSelectOption value={OccupationStatus.OPEN}>Open</IonSelectOption>
          <IonSelectOption value={OccupationStatus.HIRED}>
            Hired
          </IonSelectOption>
        </IonSelect>
      </FormItem>
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
  )
}

export default memo(ProfileForm)
