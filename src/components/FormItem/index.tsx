import React, { memo, Fragment } from "react"
import { IonItem, IonLabel, IonInput, IonNote } from "@ionic/react"

interface ContainerProps {
  name: string
  type?: "text" | "password"
  spellCheck?: boolean
  maxLength?: number
  value?: string
  onChange?: (e: CustomEvent) => void
  errorMessage?: string
  showError?: boolean
  children?: any
  lines?: "full" | "none"
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
  lines = "full",
}) => {
  return (
    <Fragment>
      <IonItem className="content" lines={lines}>
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
      {showError && (
        <IonNote color="danger" style={{ padding: "15px" }}>
          {" "}
          {errorMessage}
        </IonNote>
      )}
    </Fragment>
  )
}

export default memo(FormItem)
