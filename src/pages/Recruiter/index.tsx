import React, {
  useState,
  useMemo,
  memo,
  FormEvent,
  useRef,
  useEffect,
} from "react"
import {
  IonContent,
  IonPage,
  IonCol,
  IonRow,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
} from "@ionic/react"
import { PublicProfile, Experience, ExperienceProps } from "../../util/types"
import { Axios } from "../../redux/Actions"
import DevCard from "../../components/DevCard"
import { FormItem } from "../../components"
import Selectables from "../../components/Selectables"
import ReactTagInput from "@pathofdev/react-tag-input"
import LocationSelect from "../../components/ProfileForm/LocationSelect"

const Recruiter: React.FC = () => {
  const [fullName, setFullName] = useState<string | undefined>()
  const [company, setCompany] = useState<string | undefined>()
  const [school, setSchool] = useState<string | undefined>()
  const [techs, setTechs] = useState<string[]>([])
  const [experience, setExperience] = useState<Experience | undefined>()
  const [tech, setTech] = useState<string>("")
  const [country, setCountry] = useState<string | undefined>()
  const [region, setRegion] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const ref = useRef<any>(null)
  const [profileSearch, setProfileSearch] = useState<PublicProfile[]>([])
  const [didSearch, setDidSearch] = useState<boolean>(false)

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

  const handleOnSearch = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setDidSearch(true)
    try {
      const profileResp = await (await Axios()).post(`/recruiter/devs/search`, {
        fullName: fullName,
        school: school,
        company: company,
        techs: techs,
        experience: experience,
        country: country,
        region: region,
      })
      const profileData: PublicProfile[] = profileResp.data
      setProfileSearch(profileData)
    } finally {
      setIsLoading(false)
    }
  }

  const renderProfileResults = useMemo(() => {
    return profileSearch.length > 0 ? (
      profileSearch.map((profile, i) => (
        <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
          <DevCard dev={profile} url=""></DevCard>
        </IonCol>
      ))
    ) : didSearch && !isLoading ? (
      <IonCol>
        <p>No Developers</p>
      </IonCol>
    ) : (
      <> </>
    )
  }, [profileSearch, didSearch, isLoading])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Recruiter Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <form onSubmit={handleOnSearch}>
          <FormItem
            name="Name"
            value={fullName}
            onChange={(e) => setFullName(e.detail.value!)}
          ></FormItem>
          <FormItem name="Company">
            <IonSearchbar
              className="JobFormSearch"
              value={company}
              onIonChange={(e) => setCompany(e.detail.value)}
              debounce={300}
              placeholder=""
              searchIcon="none"
            />
            <div style={{ width: "100%" }}>
              <Selectables
                input={company || ""}
                onSelect={setCompany}
                url={`/public/search/company`}
              />
            </div>
          </FormItem>
          <FormItem name="School">
            <IonSearchbar
              className="EducationFormSearch"
              value={school}
              onIonChange={(e) => setSchool(e.detail.value)}
              searchIcon="none"
              placeholder=""
              debounce={300}
            />
            <div style={{ width: "100%" }}>
              <Selectables
                input={school || ""}
                onSelect={setSchool}
                url={`/public/search/school`}
              />
            </div>
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
          <LocationSelect
            country={country!}
            region={region!}
            onCountryChange={(val) => {
              setCountry(val)
              setRegion("")
            }}
            onRegionChange={(val) => setRegion(val)}
          />
          <IonButton fill="outline" expand="block" type="submit">
            Search
          </IonButton>
        </form>
        <IonRow>{renderProfileResults}</IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Recruiter)
