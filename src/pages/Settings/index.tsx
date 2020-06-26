import React, { memo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import {
  thunkCreateProfile,
  thunkAddJob,
  thunkAddEducation,
  thunkDeleteEducation,
  thunkDeleteJob,
  thunkUpdateProfile,
} from "../../redux/User/actions"
import "react-mde/lib/styles/css/react-mde-all.css"
import "./styles.css"
import ReactGA from "react-ga"
import JobForm from "../../components/JobForm"
import ProfileForm from "../../components/ProfileForm"
import { Degree, OccupationStatus } from "../../util/types"
import EducationForm from "../../components/EducationForm"
import EducationCard from "../../components/EducationCard"
import FormCollapse from "../../components/FormCollapse"
import JobCard from "../../components/JobCard"

type SettingSection = "profile" | "education" | "jobs"

const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SettingSection>(
    "profile"
  )

  const { email, profile, isLoading, status, educations, jobs } = useSelector(
    ({
      user: { email, profile, loading, educations, jobs },
      alerts: { status },
    }: ReduxCombinedState) => ({
      email: email,
      profile: profile,
      status: status,
      isLoading: loading,
      educations: educations,
      jobs: jobs,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const createProfile = useCallback(
    async (
      updateGitHub: string,
      updateShowEmail: boolean,
      updateEmail: string,
      updateAbout: string,
      updateHeader: string | undefined,
      updateLocation: string | undefined,
      updateFullName: string | undefined,
      updateOccupationStatus: OccupationStatus | undefined,
      updateAvatar: File | undefined
    ) => {
      dispatch(
        thunkCreateProfile(
          updateGitHub,
          updateShowEmail,
          updateEmail,
          updateAbout,
          updateHeader,
          updateLocation,
          updateFullName,
          updateOccupationStatus,
          updateAvatar
        )
      )
    },
    [dispatch]
  )
  const updateProfile = useCallback(
    async (
      profileId: number,
      updateGitHub: string,
      updateShowEmail: boolean,
      updateEmail: string,
      updateAbout: string,
      updateHeader: string | undefined,
      updateLocation: string | undefined,
      updateFullName: string | undefined,
      updateOccupationStatus: OccupationStatus | undefined,
      updateAvatar: File | undefined
    ) => {
      dispatch(
        thunkUpdateProfile(
          profileId,
          updateGitHub,
          updateShowEmail,
          updateEmail,
          updateAbout,
          updateHeader,
          updateLocation,
          updateFullName,
          updateOccupationStatus,
          updateAvatar
        )
      )
    },
    [dispatch]
  )
  const createJob = useCallback(
    async (
      company: string,
      title: string,
      start: string,
      desciption?: string,
      end?: string
    ) => {
      dispatch(thunkAddJob(company, title, start, desciption, end))
    },
    [dispatch]
  )
  const deleteJob = useCallback(
    async (id: number) => {
      dispatch(thunkDeleteJob(id))
    },
    [dispatch]
  )
  const createEducation = useCallback(
    async (
      school: string,
      major: string,
      degree: Degree,
      gradDate: string,
      minor?: string
    ) => {
      dispatch(thunkAddEducation(school, major, gradDate, degree, minor))
    },
    [dispatch]
  )
  const deleteEducation = useCallback(
    async (id: number) => {
      dispatch(thunkDeleteEducation(id))
    },
    [dispatch]
  )

  useEffect(() => {
    ReactGA.pageview(`settings`)
  }, [])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <IonSegment
          value={selectedSection}
          onIonChange={(e) =>
            setSelectedSection(e.detail.value as SettingSection)
          }
        >
          <IonSegmentButton value="profile">Profile</IonSegmentButton>
          <IonSegmentButton value="education">Education</IonSegmentButton>
          <IonSegmentButton value="jobs">Jobs</IonSegmentButton>
        </IonSegment>
        <div className="SettingsAvatarContainer">
          <img
            className="SettingsAvatar icon line-around"
            src={
              profile && profile.avatar
                ? profile.avatar
                : "assets/icon/apple-touch-icon.png"
            }
          />
        </div>
        {selectedSection === "profile" && (
          <ProfileForm
            profile={profile}
            email={email}
            status={status}
            onCreate={createProfile}
            onUpdate={updateProfile}
          />
        )}
        {selectedSection === "education" && (
          <>
            <FormCollapse title="Education">
              <EducationForm status={status} onSubmit={createEducation} />
            </FormCollapse>
            {educations.map((ed, idx) => (
              <EducationCard
                key={idx}
                education={ed}
                onDelete={deleteEducation}
              />
            ))}
          </>
        )}
        {selectedSection === "jobs" && (
          <>
            <FormCollapse title="Job">
              <JobForm status={status} onSubmit={createJob} />
            </FormCollapse>
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} onDelete={deleteJob} />
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}

export default memo(Settings)
