import React, { memo, FormEvent, useState, useEffect, useRef } from "react"
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
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import {
  Profile,
  OccupationStatus,
  OccupationStatusEnumProps,
  Experience,
  ExperienceProps,
} from "../../util/types"
import { mdConverter } from "../../util"
import ReactTagInput from "@pathofdev/react-tag-input"
import Selectables from "../Selectables"
import LocationSelect from "./LocationSelect"

interface ContainerProps {
  status: "success" | "fail" | undefined
  profile: Profile | undefined
  email: string | undefined
  onCreate: (
    gitHub: string,
    showEmail: boolean,
    email: string,
    about: string,
    header: string,
    country: string,
    region: string,
    fullName: string,
    occupationStatus: OccupationStatus,
    experience: Experience,
    avatar: File | undefined,
    techs: string[]
  ) => void
  onUpdate: (
    profileId: number,
    gitHub: string,
    showEmail: boolean,
    email: string,
    about: string,
    header: string,
    country: string,
    region: string,
    fullName: string,
    occupationStatus: OccupationStatus,
    experience: Experience,
    avatar: File | undefined,
    techs: string[]
  ) => void
}

const ProfileForm: React.FC<ContainerProps> = ({
  status,
  profile,
  email,
  onCreate,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState<string>("")
  const [gitHub, setGitHub] = useState<string>("")
  const [showEmail, setShowEmail] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<File | undefined>(undefined)
  const [country, setCountry] = useState<string>("")
  const [region, setRegion] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const [about, setAbout] = useState<string>("")
  const [experience, setExperience] = useState<Experience>()
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")
  const [updateEmail, setUpdateEmail] = useState<string>("")
  const [occupationStatus, setOccupationStatus] = useState<OccupationStatus>()
  const [techs, setTechs] = useState<string[]>([])
  const [tech, setTech] = useState<string>("")
  const ref = useRef<any>(null)

  const onInputChange = (passThrough: any) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTech(e.target.value)
    return passThrough(e)
  }

  useEffect(() => {
    if (ref.current) {
      const ogFunc = ref.current.onInputChange
      ref.current.onInputChange = onInputChange(ogFunc)
    }
  }, [ref])

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
      setFullName(profile.fullName)
      setHeader(profile.header)
      setOccupationStatus(profile.occupationStatus)
      setExperience(profile.experience)
      setTechs(profile.techs)
      setCountry(profile.country)
      setRegion(profile.region)
    }
  }, [email, profile])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    profile
      ? onUpdate(
          profile.profileId,
          gitHub,
          showEmail,
          updateEmail,
          about,
          header,
          country,
          region,
          fullName,
          occupationStatus!,
          experience!,
          avatar,
          techs
        )
      : onCreate(
          gitHub,
          showEmail,
          updateEmail,
          about,
          header,
          country,
          region,
          fullName,
          occupationStatus!,
          experience!,
          avatar,
          techs
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
        name="Full Name or Company"
        value={fullName}
        onChange={(e) => setFullName(e.detail!.value)}
        maxLength={30}
      />
      <FormItem
        name="GitHub"
        value={gitHub}
        onChange={(e) => setGitHub(e.detail.value)}
        maxLength={100}
      />
      <FormItem
        name="Email"
        value={updateEmail}
        onChange={(e) => setUpdateEmail(e.detail.value)}
        maxLength={50}
      />
      <FormItem name="Display Email?">
        <IonCheckbox
          checked={showEmail}
          onIonChange={(e) => setShowEmail(e.detail.checked)}
        />
      </FormItem>
      <LocationSelect
        country={country}
        region={region}
        onCountryChange={(s) => setCountry(s)}
        onRegionChange={(s) => setRegion(s)}
      />
      <FormItem name="Occupation Status">
        <IonSelect
          value={occupationStatus}
          onIonChange={(e) => setOccupationStatus(e.detail.value)}
        >
          <IonSelectOption value={OccupationStatus.HIRED}>
            {OccupationStatusEnumProps[OccupationStatus.HIRED]}
          </IonSelectOption>
          <IonSelectOption value={OccupationStatus.OPEN}>
            {OccupationStatusEnumProps[OccupationStatus.OPEN]}
          </IonSelectOption>
          <IonSelectOption value={OccupationStatus.LOOKING}>
            {OccupationStatusEnumProps[OccupationStatus.LOOKING]}
          </IonSelectOption>
          <IonSelectOption value={OccupationStatus.COMPANY}>
            {OccupationStatusEnumProps[OccupationStatus.COMPANY]}
          </IonSelectOption>
        </IonSelect>
      </FormItem>
      <FormItem name="Experience">
        <IonSelect
          value={experience}
          onIonChange={(e) => setExperience(e.detail.value)}
        >
          <IonSelectOption value={Experience.SCHOOL}>
            {ExperienceProps[Experience.SCHOOL]}
          </IonSelectOption>
          <IonSelectOption value={Experience.JR}>
            {ExperienceProps[Experience.JR]}
          </IonSelectOption>
          <IonSelectOption value={Experience.MID}>
            {ExperienceProps[Experience.MID]}
          </IonSelectOption>
          <IonSelectOption value={Experience.SENIOR}>
            {ExperienceProps[Experience.SENIOR]}
          </IonSelectOption>
        </IonSelect>
      </FormItem>
      <FormItem name="Top Technologies">
        <div style={{ padding: "15px", width: "100%" }}>
          <ReactTagInput
            ref={ref}
            tags={techs}
            onChange={(tags) => {
              setTechs(tags)
              setTech("")
            }}
            validator={(tag) => {
              return tag.length <= 30
            }}
            removeOnBackspace={true}
            maxTags={8}
            placeholder="Enter to add"
          />
        </div>
      </FormItem>
      <Selectables
        input={tech}
        onSelect={(value) => {
          setTechs((curr) => [...curr, value])
          setTech("")
          setTimeout(() => {
            const inputRef = ref.current.inputRef as React.RefObject<
              HTMLInputElement
            >
            if (inputRef.current) {
              inputRef.current.value = ""
            }
          }, 200)
        }}
        url={`/public/search/tech`}
      />
      <FormItem name="Header">
        <IonTextarea
          value={header}
          onIonChange={(e) => setHeader(e.detail.value!)}
          maxlength={200}
          rows={4}
          spellCheck={true}
        />
      </FormItem>
      <FormItem
        name="Biography"
        showError={about?.trim() === ""}
        errorMessage="Biography section is required"
      >
        <div
          style={{ width: "100%", paddingTop: "16px", paddingBottom: "16px" }}
        >
          <ReactMde
            classes={{ grip: "hide", toolbar: "mde-toolbar" }}
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
