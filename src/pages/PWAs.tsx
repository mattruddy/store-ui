import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonSearchbar, IonPopover, IonButton, IonList, IonItem, useIonViewDidEnter, IonInfiniteScroll, IonInfiniteScrollContent, useIonViewDidLeave, IonLoading, IonProgressBar } from '@ionic/react';
import PWACard from '../components/PWACard';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs, getSearchApp } from '../data/dataApi';
import { PWA, Search } from '../util/types';
import { RouteComponentProps, withRouter } from 'react-router';
import './main.css';

const PWAs: React.FC<RouteComponentProps> = ({
    history
}) => {

  const [page, setPage] = useState<number>(0);
  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState<PWA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Search[]>([]);
  const scrollEl = useRef<any>(undefined);

  useEffect(() => {
    loadPWAs();
    return () => {
      setPwas([]);
      setPage(0);
    }
  }, [])

  const loadPWAs = async () => {
    setIsLoading(true);
    const resp = await getPWAs(page, (cat && cat !== '') ? cat : undefined);
    if (resp && resp.length > 0) {
      setPwas(prev => prev.concat(resp));
    }
    setIsLoading(false);
  }

  const pwaList = () => {
    let resultPwas = pwas;
    if (resultPwas && resultPwas.length > 0) {
      if (cat !== '' && cat !== 'ALL') {
        resultPwas = pwas.filter(pwa => pwa.category === cat);
      }
      if (resultPwas.length > 0) {
        return resultPwas.map((pwa, idx) => <PWACard key={idx} url="/pwa" history={history} category={pwa.category} name={pwa.name} icon={pwa.icon} appId={pwa.appId} />)
      } else {
        return <div></div>
      }
    } else {
      return <div></div>
    }
  }

  const loadMorePwas = async () => {
    const nextPage = page + 1;
    const nextPwas = await getPWAs(nextPage, (cat && cat !== '') ? cat : undefined);
    if (nextPwas) {
      setPwas(prev => prev.concat(nextPwas));
      setPage(nextPage);
    }
    scrollEl.current.complete();
  }

  const onPress = (option: string) => {
    if (option === 'ALL') {
      setCat('');
    } else {
      setCat(option);
    }
  }

  const onSearchChange = async (e: CustomEvent) => {
    const appName = e.detail.value.replace(/\s/g, '');
    if (appName) {
      const results = await getSearchApp(appName);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class='header'>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <img style={{ height: '40px', width: '40px'}} src="assets/icon/logo.png" />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent class='content' style={{overflow: 'hidden'}}>
      { isLoading && <IonProgressBar type="indeterminate" /> }
      <IonSearchbar onIonChange={onSearchChange} />
          <IonList style={{ background: 'none'}}>
              { searchResults && searchResults.map((result, idx) => 
                <IonItem button onClick={() => history.push(`/pwa/${result.appId}`)} key={idx}>
                  {result.name}
                </IonItem>
              ) }
            </IonList>
        <CategoryOptions onPress={onPress} haveClear={true} />
        <IonInfiniteScroll ref={scrollEl} onIonInfinite={loadMorePwas}>
          <IonInfiniteScrollContent>
              <IonGrid >
                <IonRow>
                  {pwaList()}
                </IonRow>
              </IonGrid>
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(PWAs);
