import React, { useEffect, useRef, useState, memo } from "react"
import { IonSearchbar } from "@ionic/react"

interface ContainerProps {
  debounceOnMount?: boolean
  delay?: number
  onChangeCallback: (searchValue: string) => void
}

const DebouncedSearch: React.FC<ContainerProps> = ({
  debounceOnMount = false,
  delay = 400,
  onChangeCallback,
}) => {
  const mounted = useRef(debounceOnMount)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (mounted.current && delay) {
      const debounce = setTimeout(() => onChangeCallback(searchValue), delay)

      return () => {
        clearTimeout(debounce)
      }
    }
    mounted.current = true
  }, [searchValue])

  const handleOnChangeCallback = async (e: CustomEvent) => {
    const { value } = e.detail
    setSearchValue(value)
  }
  return <IonSearchbar onIonChange={handleOnChangeCallback} />
}

export default memo(DebouncedSearch)
