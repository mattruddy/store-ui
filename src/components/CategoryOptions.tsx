import React from 'react';
import { IonSelect, IonSelectOption } from '@ionic/react';

const categories = [
    'GAME',
    'EDUCATIONAL',
    'FOOD',
    'BUSINESS',
    'NEWS',
    'DATING',
    'SOCAIL',
    'SHOPPING',
    'TOOL'
]
interface ContainerProps {
    onPress: (option: string) => void;
    haveClear: boolean;
}

const CategoryOptions: React.FC<ContainerProps> = ({
    onPress,
    haveClear,
}) => {

    const getOptions = () => {
        return (
        categories.map((cat, idx) => <IonSelectOption key={idx} value={cat}>{`${cat.charAt(0)}${cat.slice(1).toLowerCase()}`}</IonSelectOption>)
        )
    }

  return (
      <IonSelect placeholder='Category' onIonChange={e => onPress(e.detail.value!)} >
          { haveClear && <IonSelectOption key={32432432} value="">Top</IonSelectOption> }
          {getOptions()}
      </IonSelect>
  );
};

export default CategoryOptions;