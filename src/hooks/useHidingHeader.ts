import { useState, useEffect } from "react"

type NumberDispatchType = (
  threshold: number
) => [number, React.Dispatch<React.SetStateAction<number>>]

export const useHidingHeader: NumberDispatchType = (threshold: number) => {
  const [initialChange, setInitialChange] = useState<number>(0)
  const [scrollYCurrent, setScrollYCurrent] = useState<number>(0)
  // number between 0 and 1
  const [hideDecimal, setHideDecimal] = useState<number>(0)
  const [scrollYPrevious, setScrollYPrevious] = useState<number>(0)

  useEffect(() => {
    // at the top or scrolled backwards => reset
    if (scrollYCurrent <= 0 || scrollYPrevious > scrollYCurrent) {
      setHideDecimal(0)
      setInitialChange(scrollYCurrent)
    } else {
      if (scrollYCurrent > initialChange) {
        // start hiding
        if (scrollYCurrent < initialChange + threshold)
          setHideDecimal((scrollYCurrent - initialChange) / threshold)
        // fulling hidden
        else if (hideDecimal !== 1) setHideDecimal(1)
      }
    }
    setScrollYPrevious(scrollYCurrent)
  }, [scrollYCurrent])

  return [hideDecimal, setScrollYCurrent]
}
