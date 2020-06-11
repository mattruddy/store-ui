import React, { memo, useEffect, useRef } from "react"
import { IonSearchbar } from "@ionic/react"
import ReactGA from "react-ga"

interface ContainerProps {
  delay?: number
  onChangeCallback: (value: string) => void
}

const DebouncedSearch: React.FC<ContainerProps> = ({
  delay = 400,
  onChangeCallback,
}) => {
  let ref = useRef<any>(undefined)

  useEffect(() => {
    if (ref && ref.current.getInputElement) {
      ref.current.getInputElement().then((input: any) => {
        ref.current.setFocus()
      })
    }
  }, [ref])

  const handleOnChangeCallback = async (e: CustomEvent) => {
    const { value } = e.detail
    ReactGA.event({
      category: "search",
      action: value,
    })
    const searchName = value.replace(/[^A-Za-z0-9 ]/g, "").trim()
    onChangeCallback(searchName)
  }

  return (
    <IonSearchbar
      onIonChange={handleOnChangeCallback}
      debounce={delay}
      ref={ref}
    />
  )
}

export default memo(DebouncedSearch)
