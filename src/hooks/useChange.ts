import { useState, useEffect } from "react"

type ChangesType = (
  listen: (number | string | boolean)[]
) => [boolean, (values: (number | string | boolean)[]) => void]

export const useChange: ChangesType = (
  listen: (number | string | boolean)[]
) => {
  const [isChange, setIsChange] = useState<boolean>(false)
  const [combined, setCombined] = useState<string | undefined>(undefined)
  const initialize = (values: (number | string | boolean)[]) => {
    setCombined(combine(values))
  }

  const combine = (input: (number | string | boolean)[]) => {
    const combinedValue = input.map((x) => x.toString()).join()
    return combinedValue
  }

  useEffect(() => {
    if (combined !== undefined) {
      setIsChange(combined !== combine(listen))
    }
  }, listen)

  return [isChange, initialize]
}
