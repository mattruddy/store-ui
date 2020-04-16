import React from 'react';
import { IonSelect, IonSelectOption, IonSearchbar, IonList, IonItem } from '@ionic/react';
import { Search } from '../util/types';

interface ContainerProps {
    onSearchChange: (e: CustomEvent) => void;
    onSearchPress: (result: Search) => void;
    searchResults?: Search[];
}

const SearchBarList: React.FC<ContainerProps> = ({
    onSearchChange,
    searchResults,
    onSearchPress,
}) => {

  return (
      <>
        <IonSearchbar onIonChange={onSearchChange} />
        { searchResults && searchResults.length > 0 && 
            <IonList style={{ background: 'none'}}>
                {searchResults.map((result, idx) => 
                <IonItem button onClick={() => onSearchPress(result)} key={idx}>
                    {result.name}
                </IonItem>
                )}
            </IonList>
        }
        </>
  );
};

export default SearchBarList;