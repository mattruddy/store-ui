import React, { useMemo, memo } from "react"
import { IonSelect, IonSelectOption } from "@ionic/react"
import {
  heartOutline,
  schoolOutline,
  starOutline,
  fastFoodOutline,
  gameControllerOutline,
  easelOutline,
  musicalNoteOutline,
  newspaperOutline,
  chatbubblesOutline,
  basketballOutline,
  codeOutline,
  constructOutline,
  airplaneOutline,
  cartOutline,
  businessOutline,
} from "ionicons/icons"
import { capitalize } from "../../util"
import "./styles.css"

export const categories = [
  { category: "BUSINESS", icon: businessOutline },
  { category: "DATING", icon: heartOutline },
  { category: "EDUCATION", icon: schoolOutline },
  { category: "ENTERTAINMENT", icon: starOutline },
  { category: "FOOD", icon: fastFoodOutline },
  { category: "GAME", icon: gameControllerOutline },
  { category: "LIFESTYLE", icon: easelOutline },
  { category: "MUSIC", icon: musicalNoteOutline },
  { category: "NEWS", icon: newspaperOutline },
  { category: "SHOPPING", icon: cartOutline },
  { category: "SOCIAL", icon: chatbubblesOutline },
  { category: "SPORTS", icon: basketballOutline },
  { category: "TECH", icon: codeOutline },
  { category: "TOOL", icon: constructOutline },
  { category: "TRAVEL", icon: airplaneOutline },
]
interface ContainerProps {
  onPress: (option: string) => void
  initValue?: string
}

const CategoryOptions: React.FC<ContainerProps> = ({ onPress, initValue }) => {
  const renderOptions: JSX.Element[] = useMemo(
    () =>
      categories.map((cat, i) => (
        <IonSelectOption className="OptionText" key={i} value={cat.category}>
          {capitalize(cat.category)}
        </IonSelectOption>
      )),
    []
  )

  return (
    <IonSelect
      interfaceOptions={{
        header: "Categories",
      }}
      value={initValue !== undefined ? initValue : undefined}
      placeholder="Category"
      onIonChange={(e) => onPress(e.detail.value!)}
    >
      {renderOptions}
    </IonSelect>
  )
}

export default memo(CategoryOptions)
