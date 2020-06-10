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
} from "@ionic/react"
import FormItem from "../FormItem"
import ReactTagInput from "@pathofdev/react-tag-input"
import ImageUploader from "react-images-upload"
import CategoryOptions from "../CategoryOptions"

interface ContainerProps {
  isOpen: boolean
  toggle: () => void
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
  toggle,
  onSubmit,
}) => {
  const [url, setUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [cat, setCat] = useState<string>("")
  const [icon, setIcon] = useState<File>()
  const [screenshots, setScreenshots] = useState<File[]>()
  const [tags, setTags] = useState<string[]>([])

  const addApp = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(name, desc, url, cat, icon!, screenshots!, tags)
  }

  return (
    <IonModal isOpen={isOpen} swipeToClose={true} onDidDismiss={toggle}>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Add PWA</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={toggle}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <form onSubmit={addApp}>
          <IonList>
            <FormItem
              name="name"
              type="text"
              spellCheck={false}
              value={name}
              maxLength={25}
              onChange={(e) => setName(e.detail!.value)}
              showError={true}
              errorMessage="No special chars allowed"
            />
            <FormItem name="Tags" showError={false} errorMessage="">
              <ReactTagInput
                tags={tags}
                onChange={setTags}
                validator={(tag) => tag.length <= 30}
                removeOnBackspace={true}
                maxTags={5}
                placeholder="Enter to add"
              />
            </FormItem>
            <FormItem name="Icon" showError={false} errorMessage="">
              <ImageUploader
                fileContainerStyle={{
                  boxShadow: "none",
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
              showError={false}
              errorMessage=""
            />
            <FormItem name="Description" showError={false} errorMessage="">
              <IonTextarea
                name="desc"
                placeholder="Please describe your PWA"
                rows={6}
                spellCheck={true}
                value={desc}
                maxlength={1500}
                onIonChange={(e) => setDesc(e.detail.value!)}
              />
            </FormItem>
            <FormItem name="Category" showError={false} errorMessage="">
              <CategoryOptions onPress={setCat} />
            </FormItem>
            <FormItem name="Screenshots" showError={false} errorMessage="">
              <ImageUploader
                fileContainerStyle={{
                  boxShadow: "none",
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
            <IonButton expand="full" type="submit">
              Submit
            </IonButton>
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  )
}

export default memo(SubmitAppModal)
