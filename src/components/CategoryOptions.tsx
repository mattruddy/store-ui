import React from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';

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
    haveClear: boolean;
    initValue?: string;
}

const CategoryOptions: React.FC<ContainerProps> = ({
    onPress,
    haveClear,
    initValue,
}) => {

    const getOptions = () => {
        return (
        categories.map((cat, idx) => <IonSelectOption key={idx} value={cat}>{`${cat.charAt(0)}${cat.slice(1).toLowerCase()}`}</IonSelectOption>)
        )
    }

  return (
      <IonSelect value={initValue !== undefined ? initValue : undefined} placeholder='Category' onIonChange={e => onPress(e.detail.value!)} >
          { haveClear && <IonSelectOption key={32432432} value="">Trending</IonSelectOption> }
          {getOptions()}
      </IonSelect>
  );
};

export default CategoryOptions;