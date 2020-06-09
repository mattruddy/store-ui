import React, { memo, Fragment } from "react"
import { IonItem, IonLabel, IonInput, IonText } from "@ionic/react"

interface ContainerProps {
  name: string
  type: "text" | "password"
  spellCheck: boolean
  maxLength: number
  value: string
  onChange: (e: CustomEvent) => void
  errorMessage: string
  showError?: boolean
}

const FormItem: React.FC<ContainerProps> = ({
  name,
  type,
  spellCheck,
  maxLength,
  value,
  onChange,
  errorMessage,
  showError = false,
}) => {
  return (
    <Fragment>
      <IonItem className="content">
        <IonLabel position="stacked">{name}</IonLabel>
        <IonInput
          name={name}
          type={type}
          value={value}
          spellCheck={spellCheck}
          maxlength={maxLength}
          onIonChange={onChange}
        />
      </IonItem>
      {showError && (
        <IonText color="danger">
          <p className="ion-padding-start">{errorMessage}</p>
        </IonText>
      )}
    </Fragment>
  )
}

export default memo(FormItem)
