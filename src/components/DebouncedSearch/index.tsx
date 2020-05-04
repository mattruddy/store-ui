import React, { memo } from "react"
import { IonSearchbar } from "@ionic/react"

interface ContainerProps {
  delay?: number
  onChangeCallback: (value: string) => void
}

const DebouncedSearch: React.FC<ContainerProps> = ({
  delay = 400,
  onChangeCallback,
}) => {
  const handleOnChangeCallback = async (e: CustomEvent) => {
    const { value } = e.detail
    onChangeCallback(value)
  }

  return <IonSearchbar onIonChange={handleOnChangeCallback} debounce={delay} />
}

export default memo(DebouncedSearch)
