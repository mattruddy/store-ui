import React, { memo, FormEvent, useState } from "react"
import { IonButton, IonDatetime } from "@ionic/react"
import { FormItem } from ".."

interface ContainerProps {
  onSubmit: (
    company: string,
    title: string,
    start: string,
    end?: string
  ) => void
}

const JobForm: React.FC<ContainerProps> = ({ onSubmit }) => {
  const [company, setCompany] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [start, setStart] = useState<string>()
  const [end, setEnd] = useState<string | undefined>()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(company!, title!, start!, end)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem
        name="Company"
        value={company}
        onChange={(e) => setCompany(e.detail.value)}
        maxLength={100}
        showError={!company}
        errorMessage="Company is required"
      />
      <FormItem
        name="Title"
        value={title}
        onChange={(e) => setTitle(e.detail.value)}
        maxLength={100}
        showError={!title}
        errorMessage="Title is required"
      />
      <FormItem
        name="Start Date"
        showError={!start}
        errorMessage="Start Date required"
      >
        <IonDatetime
          value={start}
          onIonChange={(e) => setStart(e.detail.value!)}
        />
      </FormItem>
      <IonButton expand="block" fill="outline" color="dark" type="submit">
        Add Job
      </IonButton>
    </form>
  )
}

export default memo(JobForm)
