import React, { useMemo, memo } from "react"
import { IonSelect, IonSelectOption } from "@ionic/react"
import {
  business,
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
} from "ionicons/icons"
import { useHistory } from "react-router"
import { GetPwaCategoryUrl } from "../../routes"
import { capitalize } from "../../util"

export const categories = [
  { category: "BUSINESS", icon: business },
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
  initValue?: string
}

const CategoryOptions: React.FC<ContainerProps> = ({ initValue }) => {
  const history = useHistory()

  const onPress = (category: any) =>
    history.push(GetPwaCategoryUrl(category.toLowerCase()))

  const renderOptions: JSX.Element[] = useMemo(
    () =>
      categories.map((cat, i) => (
        <IonSelectOption key={i} value={cat.category}>
          {capitalize(cat.category)}
        </IonSelectOption>
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
