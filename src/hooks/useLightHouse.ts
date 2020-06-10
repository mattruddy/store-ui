import { useState, useEffect } from "react"
import Axios from "axios"

export interface LighthouseTest {
  pass: boolean
  url: string
  iosIcon: boolean
  installable: boolean
  worksOffline: boolean
  error: boolean
}

type LighthouseType = () => [
  boolean,
  LighthouseTest[],
  React.Dispatch<React.SetStateAction<string>>
]

export const useLighthouse: LighthouseType = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [tests, setTests] = useState<LighthouseTest[]>([])
  const [url, setTargetUrl] = useState<string>("")

  const getLightHouseData = async (url: string) => {
    try {
      setLoading(true)
      const response = await Axios.request({
        url: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=PWA`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
      if (response.status === 200) {
        if (response.data) {
          if (response.data.lighthouseResult) {
            const data = response.data
            const lightHouseData = data.lighthouseResult
            const iosIconTest =
              lightHouseData.audits["apple-touch-icon"].score > 0 ? true : false
            const installableTest =
              lightHouseData.audits["installable-manifest"].score > 0
                ? true
                : false
            const worksOfflineTest =
              lightHouseData.audits["works-offline"].score > 0 ? true : false
            setTests([
              {
                pass:
                  iosIconTest &&
                  worksOfflineTest &&
                  (installableTest as boolean),
                url: url,
                iosIcon: iosIconTest,
                installable: installableTest,
                worksOffline: worksOfflineTest,
                error: false,
              } as LighthouseTest,
              ...tests.filter((x) => x.url !== url),
            ])
            //passed all tests.
          } else {
            console.error(`No lighthouse result`)
          }
        }
      }
    } catch (e) {
      console.error(`Issue getting lighthouse data: ${JSON.stringify(e.data)}`)

      setTests([
        {
          pass: false,
          url: url,
          iosIcon: false,
          installable: false,
          worksOffline: false,
          error: true,
        } as LighthouseTest,
        ...tests.filter((x) => x.url !== url),
      ])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (url) {
      getLightHouseData(url)
    }
  }, [url])

  return [loading, tests, setTargetUrl]
}
