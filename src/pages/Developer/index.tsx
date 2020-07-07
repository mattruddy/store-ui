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
  IonGrid,
  IonChip,
  IonLabel,
  IonCard,
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
import { PWACard } from "../../components"
import DevContentCard from "../../components/DevContentCard"

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
          occupationStatus={profile.occupationStatus}
          header={profile.header}
          fullName={profile.fullName}
          country={profile.country}
          region={profile.region}
        />
      ),
    [profile, isLoading]
  )

  useIonViewDidEnter(() => {
    ReactGA.pageview(username!)
  })

  const renderAboutSection = useMemo(() => {
    return (
      <div
        style={{ padding: "8px" }}
        dangerouslySetInnerHTML={{
          __html: mdConverter.makeHtml(profile?.about!),
        }}
      />
    )
  }, [profile])

  const renderTechsSection = useMemo(() => {
    return profile?.techs.map((tech, idx) => (
      <IonChip key={idx}>
        <IonLabel>{tech}</IonLabel>
      </IonChip>
    ))
  }, [profile])

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
          <IonCard className="line-around">
            <IonRow>
              <IonCol
                size="12"
                sizeMd={profile && profile.techs.length > 0 ? "8" : "12"}
                ref={ref}
              >
                {renderProfileSection}
              </IonCol>
              {profile && profile.techs.length > 0 && (
                <IonCol size="12" sizeMd="4">
                  {renderTechsSection}
                </IonCol>
              )}
            </IonRow>
          </IonCard>

          <IonRow>
            <IonCol
              className="no-padding"
              size="12"
              sizeMd={
                (profile?.jobs && profile?.jobs.length > 0) ||
                (profile?.educations && profile?.educations.length > 0)
                  ? "7"
                  : "12"
              }
            >
              {profile?.about && (
                <DevContentCard
                  title="Biography"
                  onClick={() => setHideAbout(!hideAbout)}
                  isHidden={hideAbout}
                >
                  {renderAboutSection}
                </DevContentCard>
              )}
              {profile?.apps && profile.apps.length > 0 && (
                <DevContentCard
                  title="Apps"
                  onClick={() => setHideApp(!hideApp)}
                  isHidden={hideApp}
                >
                  <IonRow>
                    {profile.apps.map((app, idx) => (
                      <IonCol key={idx} size="6" sizeLg="4">
                        <PWACard
                          isMyPwa={false}
                          url="/pwa"
                          pwa={app}
                          height={100}
                        />
                      </IonCol>
                    ))}
                  </IonRow>
                </DevContentCard>
              )}
            </IonCol>
            <IonCol
              className="no-padding"
              size="12"
              sizeMd={(profile?.jobs || profile?.educations) && "5"}
            >
              {profile?.jobs && profile.jobs.length > 0 && (
                <DevContentCard
                  title="Employment"
                  onClick={() => setHideEmployment(!hideEmployment)}
                  isHidden={hideEmployment}
                >
                  {profile.jobs.map((job, idx) => (
                    <JobCard key={idx} job={job} />
                  ))}
                </DevContentCard>
              )}
              {profile?.educations && profile.educations.length > 0 && (
                <DevContentCard
                  title="Education"
                  onClick={() => setHideEducation(!hideEducation)}
                  isHidden={hideEducation}
                >
                  {profile.educations.map((education, idx) => (
                    <EducationCard key={idx} education={education} />
                  ))}
                </DevContentCard>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default memo(Developer)
