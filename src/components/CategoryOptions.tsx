import React from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';

const categories = [
    'GAME',
    'EDUCATION',
    'FOOD',
    'BUSINESS',
    'NEWS',
    'DATING',
    'SOCIAL',
    'SHOPPING',
    'TOOL',
    'TECH',
    'MUSIC',
    'LIFESTYLE',
    'TRAVEL',
    'SPORTS'
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

    console.log(initValue);

    const getOptions = () => {
        return (
        categories.map((cat, idx) => <IonSelectOption key={idx} value={cat}>{`${cat.charAt(0)}${cat.slice(1).toLowerCase()}`}</IonSelectOption>)
        )
    }

  return (
      <IonSelect value={initValue ? initValue : undefined} placeholder='Category' onIonChange={e => onPress(e.detail.value!)} >
          { haveClear && <IonSelectOption key={32432432} value="">Top</IonSelectOption> }
          {getOptions()}
      </IonSelect>
  );
};

export default CategoryOptions;