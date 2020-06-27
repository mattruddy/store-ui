import React, { useState, useEffect, memo } from "react"
import { IonList, IonItem, IonLabel } from "@ionic/react"
import { Axios } from "../../redux/Actions"

interface SelectableProps {
  input: string
  url: string
  onSelect: (value: string) => void
}

const Selectables: React.FC<SelectableProps> = ({ input, onSelect, url }) => {
  const [search, setSearch] = useState<string[]>([])

  useEffect(() => {
    if (!input) return
    ;(async () => {
      console.log(input)
      const resp = await (await Axios()).get(`${url}/${input}`)
      setSearch(resp.data)
    })()
  }, [input])

  return (
    <>
      {search && input && !search.includes(input) && (
        <IonList style={{ padding: "16px" }} lines="none">
          {search.map((x, i) => (
            <IonItem
              className="bottom-wrap-border"
              style={{ margin: "0px" }}
              button
              onClick={() => {
                onSelect(x)
              }}
              key={i}
            >
              <IonLabel style={{ margin: "0px" }}>
                <small>{x}</small>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  )
}

export default memo(Selectables)
