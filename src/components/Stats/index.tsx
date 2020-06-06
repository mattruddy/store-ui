import { useState, useEffect, useMemo } from "react"
import { IonRow, IonCol } from "@ionic/react"
import React from "react"
import { VictoryChart, VictoryArea, VictoryAxis, VictoryLine } from "victory"
import { Axios } from "../../redux/Actions"
import moment, { Moment } from "moment"
import { time } from "ionicons/icons"

interface ComponentProps {
  appId: number
}

interface AppAnalytics {
  installDates: Date[]
  pageViewDates: Date[]
}

interface SumAcc {
  sum: number
  prev: Moment
}

const Stats: React.FC<ComponentProps> = ({ appId }) => {
  const [loadingStats, setLoadingStats] = useState<boolean>(false)
  const [analytics, setAnalytics] = useState<AppAnalytics>({
    installDates: [],
    pageViewDates: [],
  })

  const installData = {}

  // 1 = 1 sec
  const [timeDelta, setTimeDeta] = useState<number>(500)

  const getData = async () => {
    const resp = await (await Axios()).get(`secure/pwas/stats/${appId}`)
    const { data } = resp
    setAnalytics(data as AppAnalytics)
  }

  useEffect(() => {
    ;(async () => {
      getData()
    })()
  }, [appId])

  const calculateData = (data: Date[]) => {
    const moments = analytics.installDates.map((d) => moment(d.toString()))
    let dates: Moment[] = []
    if (data.length > 0) {
      const minDate = moment.min(moments)
      const maxDate = moment.max(moments).add(timeDelta, "second")
      let currentDate = minDate
      while (currentDate.isBefore(maxDate)) {
        dates = [...dates, moment(currentDate.toDate().toString())]
        currentDate.add(timeDelta, "second")
      }

      const datesReduce = (prev: Moment, curr: Moment, arr: Moment[]) => {
        return arr.reduce<number>(
          (acc, c) => acc + (c.isBetween(prev, curr) ? 1 : 0),
          0
        )
      }

      const sums = dates
        .reduce<SumAcc[]>((sumsAcc, currentDate) => {
          return [
            ...sumsAcc,
            {
              sum: datesReduce(
                sumsAcc.length > 0
                  ? sumsAcc[sumsAcc.length - 1].prev
                  : currentDate,
                currentDate,
                moments
              ),
              prev: currentDate,
            } as SumAcc,
          ]
        }, [])
        .map((x) => x.sum)

      const finalData = dates.map((date, i) => ({
        x: date.toDate().toLocaleString(),
        y: sums[i],
      }))
      return finalData
    }
    return []
  }

  const renderChart = useMemo(() => {
    const data = calculateData(analytics.installDates)
    return (
      <VictoryChart domainPadding={{ x: 40 }}>
        <VictoryLine data={data} />
      </VictoryChart>
    )
  }, [analytics])

  return (
    <IonRow>
      <IonRow>
        <IonCol>{renderChart}</IonCol>
      </IonRow>
      <IonRow>
        <IonCol></IonCol>
      </IonRow>
    </IonRow>
  )
}

export default Stats
