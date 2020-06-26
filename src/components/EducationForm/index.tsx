import React, { memo, FormEvent, useState, useEffect } from "react"
import {
  IonButton,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react"
import { FormItem } from ".."
import { Degree } from "../../util/types"
import { getDateAfterYears } from "../../util"
import { Axios } from "../../redux/Actions"

interface ContainerProps {
  status: "success" | "fail" | undefined
  onSubmit: (
    school: string,
    major: string,
    degree: Degree,
    gradDate: string,
    minor?: string
  ) => void
}

const EducationForm: React.FC<ContainerProps> = ({ status, onSubmit }) => {
  const [school, setSchool] = useState<string>()
  const [major, setMajor] = useState<string>()
  const [gradDate, setGradDate] = useState<string>()
  const [degree, setDegree] = useState<Degree>()
  const [minor, setMinor] = useState<string | undefined>()
  const [search, setSearch] = useState<string[]>([])

  useEffect(() => {
    if (status === "success") {
      setSchool(undefined)
      setDegree(undefined)
      setGradDate(undefined)
      setMinor(undefined)
      setMajor(undefined)
    }
  }, [status])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(school!, major!, degree!, gradDate!, minor)
  }

  const onTypeChange = async (value: string) => {
    const resp = await (await Axios()).get(`/public/search/school/${value}`)
    setSearch(resp.data)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem
        name="School"
        value={school}
        onChange={(e) => {
          setSchool(e.detail.value)
          onTypeChange(e.detail.value)
        }}
        maxLength={100}
      />
      {search && school && !search.includes(school) && (
        <IonList>
          {search.map((x, i) => (
            <IonItem
              button
              onClick={() => {
                setSchool(x)
                setSearch([])
              }}
            >
              <IonLabel>{x}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
      <FormItem
        name="Major"
        value={major}
        onChange={(e) => setMajor(e.detail.value)}
        maxLength={100}
      ></FormItem>
      <FormItem
        name="Minor (optional)"
        value={minor}
        onChange={(e) => setMinor(e.detail.value)}
        maxLength={100}
      />
      <FormItem name="Graduation Date">
        <IonDatetime
          value={gradDate}
          max={getDateAfterYears(4)}
          displayFormat="MMM, YYYY"
          onIonChange={(e) => setGradDate(e.detail.value!)}
        />
      </FormItem>
      <FormItem name="Degree">
        <IonSelect
          interfaceOptions={{
            header: "Degree",
          }}
          value={degree}
          onIonChange={(e) => setDegree(e.detail.value)}
        >
          <IonSelectOption value={Degree.ASSOCIATE}>Associate</IonSelectOption>
          <IonSelectOption value={Degree.BACHELOR}>Bachelor</IonSelectOption>
          <IonSelectOption value={Degree.MASTER}>Master</IonSelectOption>
          <IonSelectOption value={Degree.DOCTORAL}>Doctoral</IonSelectOption>
        </IonSelect>
      </FormItem>
      <IonButton
        disabled={!school || !major || !gradDate || !degree}
        expand="block"
        fill="outline"
        color="dark"
        type="submit"
      >
        Add Education
      </IonButton>
    </form>
  )
}

export default memo(EducationForm)
