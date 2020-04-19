import React from 'react';
import { IonSelect, IonSelectOption, IonItem, IonItemDivider } from '@ionic/react';

const categories = [
    'BUSINESS',
    'DATING',
    'EDUCATION',
    'ENTERTAINMENT',
    'FOOD',
    'GAME',
    'LIFESTYLE',
    'MUSIC',
    'NEWS',
    'SHOPPING',
    'SOCIAL',
    'SPORTS',
    'TECH',
    'TOOL',
    'TRAVEL',
]
interface ContainerProps {
    onPress: (option: string) => void;
    initValue?: string;
}

const CategoryOptions: React.FC<ContainerProps> = ({
    onPress,
    initValue,
}) => {

    const getOptions = () => {
        return (
        categories.map((cat, idx) => <IonSelectOption key={idx} value={cat}>{`${cat.charAt(0)}${cat.slice(1).toLowerCase()}`}</IonSelectOption>)
        )
    }

  return (
      <IonSelect 
        interface='popover'
        interfaceOptions={{
            header: 'Categories'
        }} 
        color='dark'
        value={initValue !== undefined ? initValue : undefined} 
        placeholder='Category' 
        onIonChange={e => onPress(e.detail.value!)} 
       >
          {getOptions()}
      </IonSelect>
  );
};

export default CategoryOptions;