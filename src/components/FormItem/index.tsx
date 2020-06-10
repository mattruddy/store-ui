import React, { memo, Fragment } from "react"
import { IonItem, IonLabel, IonInput, IonText, IonNote } from "@ionic/react"

interface ContainerProps {
  name: string
  type?: "text" | "password"
  spellCheck?: boolean
  maxLength?: number
  value?: string
  onChange?: (e: CustomEvent) => void
  errorMessage: string
  showError: boolean
  children?: any
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
  children,
}) => {
  return (
    <Fragment>
      <IonItem className="content">
        <IonLabel position="stacked">{name}</IonLabel>
        {children ? (
          children
        ) : (
          <IonInput
            name={name}
            type={type}
            value={value}
            spellCheck={spellCheck}
            maxlength={maxLength}
            onIonChange={onChange}
          />
        )}
      </IonItem>
      {showError && <IonNote color="danger"> {errorMessage}</IonNote>}
    </Fragment>
  )
}

export default memo(FormItem)
