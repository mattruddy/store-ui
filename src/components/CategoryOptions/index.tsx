import React, { useMemo, memo } from "react"
import {
  IonSelect,
  IonSelectOption,
  IonItem,
  IonItemDivider,
  IonLabel,
} from "@ionic/react"

export const categories = [
  "BUSINESS",
  "DATING",
  "EDUCATION",
  "ENTERTAINMENT",
  "FOOD",
  "GAME",
  "LIFESTYLE",
  "MUSIC",
  "NEWS",
  "SHOPPING",
  "SOCIAL",
  "SPORTS",
  "TECH",
  "TOOL",
  "TRAVEL",
]
interface ContainerProps {
  onPress: (option: string) => void
  initValue?: string
}

const CategoryOptions: React.FC<ContainerProps> = ({ onPress, initValue }) => {
  const renderOptions: JSX.Element[] = useMemo(
    () =>
      categories.map((cat, i) => (
        <IonSelectOption key={i} value={cat}>{`${cat.charAt(0)}${cat
          .slice(1)
          .toLowerCase()}`}</IonSelectOption>
      )),
    [categories]
  )

  return (
    <IonSelect
      interface="popover"
      interfaceOptions={{
        header: "Categories",
      }}
      color="dark"
      value={initValue !== undefined ? initValue : undefined}
      placeholder="Category"
      onIonChange={(e) => onPress(e.detail.value!)}
    >
      {renderOptions}
    </IonSelect>
  )
}

export default memo(CategoryOptions)
