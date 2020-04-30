import React, { memo } from "react"
import {
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonList,
  IonItem,
} from "@ionic/react"
import { Search } from "../../util/types"

interface ContainerProps {
  onSearchChange: (e: CustomEvent) => void
  onSearchPress: (result: Search) => void
  searchResults?: Search[]
}

const SearchBarList: React.FC<ContainerProps> = ({
  onSearchChange,
  searchResults,
  onSearchPress,
}) => {
  return (
    <>
      <IonSearchbar onIonChange={onSearchChange} />
      {searchResults && searchResults.length > 0 && (
        <IonList
          style={{
            height: "250px",
            overflow: "scroll",
            position: "absolute",
            zIndex: "10000",
            width: "100%",
            boxShadow: "0px 0px 8px 2px #000000",
          }}
        >
          {searchResults.map((result, idx) => (
            <IonItem
              button
              detail
              onClick={() => onSearchPress(result)}
              key={idx}
            >
              {result.name}
            </IonItem>
          ))}
        </IonList>
      )}
    </>
  )
}

export default memo(SearchBarList)
