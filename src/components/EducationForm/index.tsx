import React, { memo, FormEvent, useState } from "react"
import {
  IonButton,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from "@ionic/react"
import { FormItem } from ".."
import { Degree } from "../../util/types"

interface ContainerProps {
  onSubmit: (
    school: string,
    major: string,
    degree: Degree,
    gradDate: string,
    minor?: string
  ) => void
}

const EducationForm: React.FC<ContainerProps> = ({ onSubmit }) => {
  const [school, setSchool] = useState<string>()
  const [major, setMajor] = useState<string>()
  const [gradDate, setGradDate] = useState<string>()
  const [degree, setDegree] = useState<Degree>()
  const [minor, setMinor] = useState<string | undefined>()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(school!, major!, degree!, gradDate!, minor)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem
        name="School"
        value={school}
        onChange={(e) => setSchool(e.detail.value)}
        maxLength={100}
      />
      <FormItem
        name="Major"
        value={major}
        onChange={(e) => setMajor(e.detail.value)}
        maxLength={100}
      />
      <FormItem
        name="Minor (optional)"
        value={minor}
        onChange={(e) => setMinor(e.detail.value)}
        maxLength={100}
      />
      <FormItem name="Graduation Date">
        <IonDatetime
          value={gradDate}
          displayFormat="MMM, YYYY"
          onIonChange={(e) => setGradDate(e.detail.value!)}
        />
      </FormItem>
      <FormItem name="Degree">
        <IonSelect
          interfaceOptions={{
            header: "Degree",
          }}
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
