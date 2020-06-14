import React, { memo, useState, FormEvent } from "react"
import {
  IonModal,
  IonButton,
  IonTextarea,
  IonList,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonRow,
  IonCol,
  IonText,
  IonSpinner,
} from "@ionic/react"
import FormItem from "../FormItem"
import ReactTagInput from "@pathofdev/react-tag-input"
import ImageUploader from "react-images-upload"
import CategoryOptions from "../CategoryOptions"
import { useLighthouse } from "../../hooks/useLightHouse"
import { Lighthouse } from ".."
import { noSpecialChars, validAppUpload } from "../../util"
import "@pathofdev/react-tag-input/build/index.css"

interface ContainerProps {
  isOpen: boolean
  closeModal: () => void
  onSubmit: (
    name: string,
    description: string,
    url: string,
    category: string,
    icon: File,
    screenshots: File[],
    tags: string[]
  ) => void
}

const SubmitAppModal: React.FC<ContainerProps> = ({
  isOpen,
  closeModal,
  onSubmit,
}) => {
  const [url, setUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [cat, setCat] = useState<string>("")
  const [icon, setIcon] = useState<File>()
  const [screenshots, setScreenshots] = useState<File[]>()
  const [tags, setTags] = useState<string[]>([])
  const [testLoading, lightHouseTests, setTargetUrl] = useLighthouse()

  const addApp = (e: FormEvent) => {
    e.preventDefault()
    if (validAppUpload(name, desc, url, cat, icon, screenshots)) {
      onSubmit(name, desc, url, cat, icon!, screenshots!, tags)
      setName("")
      setDesc("")
      setUrl("")
      setCat("")
      setIcon(undefined)
      setScreenshots(undefined)
      setTags([])
      closeModal()
    }
  }

  return (
    <IonModal isOpen={isOpen} swipeToClose={true} onDidDismiss={closeModal}>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Add PWA</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <form onSubmit={addApp}>
          <IonList style={{ background: "inherit" }}>
            <FormItem
              name="Name"
              type="text"
              spellCheck={false}
              value={name}
              maxLength={25}
              onChange={(e) => setName(e.detail!.value)}
              showError={!noSpecialChars(name)}
              errorMessage="No special chars allowed"
            />
            <FormItem name="Tags" showError={false} errorMessage="">
              <div style={{ padding: "15px", width: "100%" }}>
                <ReactTagInput
                  tags={tags}
                  onChange={setTags}
                  validator={(tag) => tag.length <= 30}
                  removeOnBackspace={true}
                  maxTags={5}
                  placeholder="Enter to add"
                />
              </div>
            </FormItem>
            <FormItem
              name="Icon"
              showError={false}
              errorMessage="Icon is required"
            >
              <ImageUploader
                fileContainerStyle={{
                  boxShadow: "none",
                  background: "inherit",
                  padding: "0",
                }}
                withPreview={true}
                withLabel={false}
                singleImage={true}
                withIcon={false}
                buttonText="Choose Icon"
                onChange={(files: File[]) => setIcon(files[0])}
                imgExtension={[".jpg", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </FormItem>
            <FormItem
              name="Link"
              type="text"
              maxLength={80}
              spellCheck={false}
              value={url}
              onChange={(e) => setUrl(e.detail.value!)}
              showError={url !== "" && !/^((https))/.test(url)}
              errorMessage="Must be https"
            />
            <FormItem
              name="Description"
              showError={false}
              errorMessage="Description is required"
            >
              <IonTextarea
                name="desc"
                rows={6}
                spellCheck={true}
                value={desc}
                maxlength={1500}
                onIonChange={(e) => setDesc(e.detail.value!)}
              />
            </FormItem>
            <FormItem
              name="Category"
              showError={false}
              errorMessage="Category is required"
            >
              <CategoryOptions onPress={setCat} />
            </FormItem>
            <FormItem
              name="Screenshots"
              showError={false}
              errorMessage="Screenshots are required"
            >
              <ImageUploader
                fileContainerStyle={{
                  boxShadow: "none",
                  background: "inherit",
                  padding: "0",
                }}
                withPreview={true}
                withLabel={false}
                singleImage={false}
                withIcon={false}
                onChange={setScreenshots}
                buttonText="Choose Screenshots"
                imgExtension={[".jpg", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </FormItem>
            {url !== "" &&
              !lightHouseTests.some((x) => x.url === url && x.pass) && (
                <IonButton
                  expand="block"
                  onClick={() => url && setTargetUrl(url)}
                  disabled={testLoading}
                >
                  {testLoading ? (
                    <IonSpinner />
                  ) : (
                    <p>Run Lighthouse PWA Check</p>
                  )}
                </IonButton>
              )}
            {lightHouseTests.some((x) => x.url === url && !x.error) && (
              <Lighthouse
                installable={
                  lightHouseTests.find((x) => x.url === url)!.installable
                }
                iosIcon={lightHouseTests.find((x) => x.url === url)!.iosIcon}
                runsOffline={
                  lightHouseTests.find((x) => x.url === url)!.worksOffline
                }
              />
            )}
            {lightHouseTests.some((x) => x.url === url && x.error) && (
              <IonRow>
                <IonCol>
                  <IonText color="danger">
                    <p>
                      There was an error running your site through Lighthouse.
                      Please contact support if you think this is a problem with
                      the store.
                    </p>
                  </IonText>
                </IonCol>
              </IonRow>
            )}
            {lightHouseTests.some((x) => x.url === url && !x.error) &&
              (lightHouseTests.some((x) => x.url === url && x.pass) ? (
                <IonButton
                  expand="block"
                  disabled={
                    !validAppUpload(name, desc, url, cat, icon, screenshots)
                  }
                  onClick={addApp}
                >
                  Submit
                </IonButton>
              ) : (
                <IonRow>
                  <IonCol>
                    <IonText color="danger">
                      <p>
                        Your app has not passed the proper tests on Lighthouse.
                      </p>
                    </IonText>
                  </IonCol>
                </IonRow>
              ))}
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  )
}

export default memo(SubmitAppModal)
