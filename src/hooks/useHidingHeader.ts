import { useState, useEffect } from "react"

type BooleanDispatchType = (
  threshold: number
) => [boolean, number, React.Dispatch<React.SetStateAction<number>>]

export const useHidingHeader: BooleanDispatchType = (threshold: number) => {
  const [showHeader, setShowHeader] = useState<boolean>(true)
  const [initialChange, setInitialChange] = useState<number>(1)
  const [scrollYCurrent, setScrollYCurrent] = useState<number>(0)
  // number between 0 and 1
  const [heightPercentage, setHeightPercentage] = useState<number>(1)
  const [scrollYPrevious, setScrollYPrevious] = useState<number>(0)

  useEffect(() => {
    if (scrollYCurrent === 0) {
      setShowHeader(true)
      setHeightPercentage(0)
      setInitialChange(1)
    } else if (showHeader) {
      if (scrollYCurrent > initialChange) {
        if (scrollYPrevious > scrollYCurrent) {
          setShowHeader(true)
          setHeightPercentage(0)
          setInitialChange(1)
        }
        if (scrollYCurrent < initialChange + threshold) {
          // const height =
          //   1 / (initialChange + (scrollYCurrent - initialChange) * 0.1)
          const height = (scrollYCurrent - initialChange) / threshold

          //initialChange / (initialChange + scrollYCurrent)
          setHeightPercentage(height)
        } else {
          setShowHeader(false)
          setInitialChange(scrollYCurrent)
        }
      } else if (scrollYCurrent < initialChange) {
        setInitialChange(scrollYCurrent)
      }
    } else {
      if (scrollYCurrent < initialChange) {
        setShowHeader(true)
        setHeightPercentage(0)
      }
      setInitialChange(scrollYCurrent)
    }
    setScrollYPrevious(scrollYCurrent)
  }, [scrollYCurrent])

  return [showHeader, heightPercentage, setScrollYCurrent]
}
