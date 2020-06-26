import React, { memo, useMemo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonButtons,
  IonCol,
  IonBackButton,
  useIonViewDidEnter,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonIcon,
} from "@ionic/react"
import { useParams } from "react-router"
import ProfileCard from "../../components/ProfileCard"
import { mdConverter } from "../../util"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetDev } from "../../redux/PWAs/actions"
import ReactGA from "react-ga"
import { useInView } from "react-intersection-observer"
import { Axios } from "../../redux/Actions"
import EducationCard from "../../components/EducationCard"
import JobCard from "../../components/JobCard"
import { addCircle } from "ionicons/icons"
import DevAppsCard from "../../components/DevAppsCard"

const Developer: React.FC = () => {
  const { username } = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [hideAbout, setHideAbout] = useState<boolean>(false)
  const [hideEmployment, setHideEmployment] = useState<boolean>(false)
  const [hideEducation, setHideEducation] = useState<boolean>(false)
  const [hideApp, setHideApp] = useState<boolean>(false)
  const [ref, inView] = useInView()

  const { profile, isLoading } = useSelector(
    ({ pwas: { devs, isDevPending } }: ReduxCombinedState) => ({
      profile: devs.find(
        (x) => x.username.toLowerCase() === username?.toLowerCase()
      ),
      isLoading: isDevPending,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const addDev = useCallback(
    async (username: string) => dispatch(thunkGetDev(username)),
    [dispatch]
  )

  useEffect(() => {
    ;(async () => {
      if (!notFound) {
        if (!profile && username) {
          const fetchedDev = await addDev(username)
          if (!fetchedDev) {
            setNotFound(true)
          }
        }
      }
    })()
  }, [notFound, profile, username])

  useEffect(() => {
    if (profile) {
      ;(async () =>
        await (await Axios()).post(
          `public/profile/view/${profile.profileId}`
        ))()
      ReactGA.event({
        category: `profile view for ${profile.username}`,
        action: profile.username,
      })
    }
  }, [profile])

  const renderProfileSection = useMemo(
    () =>
      profile && (
        <ProfileCard
          isMyProfile={false}
          gitHub={profile.gitHub}
          email={profile.email}
          avatar={profile.avatar}
          isLoading={isLoading}
          username={profile.username}
          header={profile.header}
          fullName={profile.fullName}
          location={profile.location}
        />
      ),
    [profile, isLoading]
  )

  useIonViewDidEnter(() => {
    ReactGA.pageview(username!)
  })

  const renderAboutSection = useMemo(() => {
    return (
      <IonCard className="">
        <div
          style={{ margin: "0", paddingLeft: "16px" }}
          dangerouslySetInnerHTML={{
            __html: mdConverter.makeHtml(profile?.about!),
          }}
        />
      </IonCard>
    )
  }, [profile?.about])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{inView ? "Developer" : profile?.username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonGrid>
          <IonRow>
            <IonCol className="bottom-line-border" size="12" ref={ref}>
              {renderProfileSection}
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol
              size="12"
              sizeMd={(profile?.jobs || profile?.educations) && "7"}
            >
              {profile?.apps && profile.apps.length > 0 && (
                <IonCard className="line-around">
                  <IonCardHeader
                    onClick={() => setHideApp(!hideApp)}
                    className="bottom-line-border clickable"
                  >
                    <IonCardTitle>Apps</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={hideApp ? "hide" : ""}>
                    <IonRow>
                      {profile.apps.map((app, idx) => (
                        <IonCol size="6">
                          <DevAppsCard key={idx} app={app} />
                        </IonCol>
                      ))}
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              )}
              <IonCard className="line-around">
                <IonCardHeader
                  onClick={() => setHideAbout(!hideAbout)}
                  className="bottom-line-border clickable"
                >
                  <IonCardTitle>Resume</IonCardTitle>
                </IonCardHeader>
                <IonCardContent className={hideAbout ? "hide" : ""}>
                  {renderAboutSection}
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol
              size="12"
              sizeMd={(profile?.jobs || profile?.educations) && "5"}
            >
              {profile?.educations && profile.educations.length > 0 && (
                <IonCard className="line-around">
                  <IonCardHeader
                    onClick={() => setHideEducation(!hideEducation)}
                    className="bottom-line-border clickable"
                  >
                    <IonCardTitle>Education</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={hideEducation ? "hide" : ""}>
                    {profile.educations.map((education, idx) => (
                      <EducationCard education={education} />
                    ))}
                  </IonCardContent>
                </IonCard>
              )}
              {profile?.jobs && profile.jobs.length > 0 && (
                <IonCard className="line-around">
                  <IonCardHeader
                    onClick={() => setHideEmployment(!hideEmployment)}
                    className="bottom-line-border clickable"
                  >
                    <IonCardTitle>Employment</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent className={hideEmployment ? "hide" : ""}>
                    {profile.jobs.map((job, idx) => (
                      <JobCard job={job} />
                    ))}
                  </IonCardContent>
                </IonCard>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default memo(Developer)
