import React, { memo, FormEvent, useState, useEffect } from "react"
import { IonButton, IonDatetime, IonCheckbox } from "@ionic/react"
import { FormItem } from ".."
import ReactMde from "react-mde"
import Selectables from "../Selectables"

interface ContainerProps {
  status: "success" | "fail" | undefined
  onSubmit: (
    company: string,
    title: string,
    start: string,
    description?: string,
    end?: string
  ) => void
}

const JobForm: React.FC<ContainerProps> = ({ status, onSubmit }) => {
  const [company, setCompany] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [start, setStart] = useState<string>()
  const [end, setEnd] = useState<string | undefined>()
  const [isPresent, setIsPresent] = useState<boolean>(true)

  useEffect(() => {
    if (status === "success") {
      setCompany(undefined)
      setTitle(undefined)
      setDescription(undefined)
      setStart(undefined)
      setEnd(undefined)
      setIsPresent(true)
    }
  }, [status])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(company!, title!, start!, description, end)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormItem
        name="Company"
        value={company}
        onChange={(e) => setCompany(e.detail.value)}
        maxLength={100}
      />
      <Selectables
        input={company || ""}
        onSelect={setCompany}
        url={`/public/search/company`}
      />
      <FormItem
        name="Title"
        value={title}
        onChange={(e) => setTitle(e.detail.value)}
        maxLength={100}
      />
      <FormItem name="Description (optional)">
        <div style={{ width: "100%", padding: "16px" }}>
          <ReactMde
            classes={{ grip: "hide", toolbar: "mde-toolbar" }}
            value={description}
            onChange={setDescription}
            toolbarCommands={[]}
          />
        </div>
      </FormItem>
      <FormItem name="Start Date">
        <IonDatetime
          value={start}
          displayFormat="MMM, YYYY"
          onIonChange={(e) => setStart(e.detail.value!)}
        />
      </FormItem>
      <FormItem name="Present?">
        <IonCheckbox
          checked={isPresent}
          onIonChange={(e) => setIsPresent(e.detail.checked)}
        />
      </FormItem>
      {!isPresent && (
        <FormItem name="End Date">
          <IonDatetime
            value={end}
            displayFormat="MMM, YYYY"
            onIonChange={(e) => setEnd(e.detail.value!)}
          />
        </FormItem>
      )}
      <IonButton
        disabled={!company || !title || !start || (!isPresent && !end)}
        expand="block"
        fill="outline"
        color="dark"
        type="submit"
      >
        Add Job
      </IonButton>
    </form>
  )
}

export default memo(JobForm)
