import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonSearchbar, IonPopover, IonButton, IonList, IonItem, useIonViewDidEnter, IonInfiniteScroll, IonInfiniteScrollContent, useIonViewDidLeave, IonLoading, IonProgressBar, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonButtons, IonIcon } from '@ionic/react';
import PWACard from '../components/PWACard';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs, getSearchApp } from '../data/dataApi';
import { PWA, Search } from '../util/types';
import { RouteComponentProps, withRouter } from 'react-router';
import './main.css';
import { setLoading } from '../data/user/user.actions';
import { search } from 'ionicons/icons';
import SearchBarList from '../components/SearchBarList';

const PWAs: React.FC<RouteComponentProps> = ({
    history
}) => {

  const [page, setPage] = useState<number>(0);
  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState<PWA[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Search[]>([]);
  const scrollEl = useRef<any>(undefined);
  const content = useRef<any>();

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
      if (cat !== '' && cat !== 'ALL' && cat !== 'NEW') {
        resultPwas = pwas.filter(pwa => pwa.category === cat);
      }
      if (resultPwas.length > 0) {
        return (
          <>
            {resultPwas.map((pwa, idx) => <PWACard key={idx} url="/pwa" history={history} category={pwa.category} name={pwa.name} icon={pwa.icon} appId={pwa.appId} />)}
            <div style={{height: '330px', width: '330px', margin: '10px'}}></div>
            <div style={{height: '330px', width: '330px', margin: '10px'}}></div>
            <div style={{height: '330px', width: '330px', margin: '10px'}}></div>
          </>
        )
      } else {
        return <div></div>
      }
    } else {
      return <div></div>
    }
  }

  const loadMorePwas = async () => {
    try {
      const nextPage = page + 1;
      const nextPwas = await getPWAs(nextPage, (cat && cat !== '') ? cat : undefined);
      if (nextPwas) {
        setPwas(prev => prev.concat(nextPwas));
        setPage(nextPage);
      }
    } finally {
      scrollEl.current.complete();
    }
  }

  const onPress = (option: string) => {
    setCat(option);
    reloadPwas(option);
  }

  const onSearchPress = (result: Search) => {
    setShowPopover(false);
    setSearchResults([]);
    history.push(`/pwa/${result.appId}`);
  }

  const reloadPwas = async (option?: string) => {
    try {
      setLoading(true);
      setPwas([]);
      setPage(0);
      const resp = await getPWAs(0, (option || option === '') ? option : ((cat && cat !== '') ? cat : undefined));
      setPwas(resp);
    } finally {
      setLoading(false);
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
          <IonPopover
            isOpen={showPopover}
            onDidDismiss={() => setShowPopover(false)}
            translucent={true}
          >
            <SearchBarList onSearchChange={onSearchChange} searchResults={searchResults} onSearchPress={onSearchPress} />
          </IonPopover>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}><IonIcon icon={search} /></IonButton>
          </IonButtons>
          <IonTitle onClick={() => {
            content.current.scrollToTop();
          }}>
            <img style={{ height: '40px', width: '40px'}} src="assets/icon/logo.png" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class='content' ref={content}>
        <IonRefresher 
          slot='fixed'
          onIonRefresh={async(event: any) => {
            try {
              await reloadPwas();
            } finally {
              event.detail.complete();
            }
          }}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      { isLoading && <IonProgressBar type="indeterminate" /> }
            <div style={{boxShadow: '0 0 3px #ccc', margin: '10px'}}>
              <CategoryOptions onPress={onPress} initValue={cat} />
            </div>
            <IonSegment value={cat} onIonChange={(e) => {
              setCat(e.detail.value!);
            }}>
              <IonSegmentButton value=''>Trending</IonSegmentButton>
              <IonSegmentButton value='NEW'>New</IonSegmentButton>
            </IonSegment>
            <IonGrid>
              <IonRow style={{display: 'flex', justifyContent: 'center'}}>
                {pwaList()}
              </IonRow>
            </IonGrid>
          <IonInfiniteScroll ref={scrollEl} threshold='1000px' onIonInfinite={loadMorePwas}>
            <IonInfiniteScrollContent>
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(PWAs);
