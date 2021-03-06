import React, { memo, useState, FormEvent } from "react"
import { IonButton, IonList, IonSpinner } from "@ionic/react"
import FormItem from "../FormItem"
import ReactTagInput from "@pathofdev/react-tag-input"
import ImageUploader from "react-images-upload"
import CategoryOptions from "../CategoryOptions"
import { noSpecialChars, validAppUpload, mdConverter } from "../../util"
import "@pathofdev/react-tag-input/build/index.css"
import ReactMde from "react-mde"

interface ContainerProps {
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

const SubmitAppForm: React.FC<ContainerProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [cat, setCat] = useState<string>("")
  const [icon, setIcon] = useState<File>()
  const [screenshots, setScreenshots] = useState<File[]>()
  const [tags, setTags] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

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
    }
  }

  return (
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
          name="Category"
          showError={false}
          errorMessage="Category is required"
        >
          <CategoryOptions onPress={setCat} />
        </FormItem>
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
          name="Description"
          showError={desc.length > 1500}
          errorMessage="Description cannot be more than 1500 characters"
        >
          <div
            style={{ width: "100%", paddingTop: "16px", paddingBottom: "16px" }}
          >
            <ReactMde
              classes={{ grip: "hide", toolbar: "mde-toolbar" }}
              value={desc}
              onChange={setDesc}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(md) =>
                Promise.resolve(mdConverter.makeHtml(desc))
              }
            />
          </div>
        </FormItem>
        <FormItem name="Icon" showError={false} errorMessage="Icon is required">
          <ImageUploader
            fileContainerStyle={{
              boxShadow: "none",
              background: "inherit",
              padding: "0",
            }}
            withPreview={icon && true}
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
          name="Screenshots"
          showError={
            screenshots !== undefined &&
            (screenshots.length < 0 || screenshots.length > 6)
          }
          errorMessage="1 to 6 screenshots allowed"
        >
          <ImageUploader
            fileContainerStyle={{
              boxShadow: "none",
              background: "inherit",
              padding: "0",
            }}
            withPreview={screenshots && screenshots.length > 0}
            withLabel={false}
            singleImage={false}
            withIcon={false}
            onChange={setScreenshots}
            buttonText="Choose Screenshots"
            imgExtension={[".jpg", ".png", ".jpeg"]}
            maxFileSize={5242880}
          />
        </FormItem>
        <IonButton
          className="button-no-shadow"
          expand="block"
          fill="outline"
          color="dark"
          disabled={!validAppUpload(name, desc, url, cat, icon, screenshots)}
          onClick={addApp}
        >
          Submit
        </IonButton>
      </IonList>
    </form>
  )
}

export default memo(SubmitAppForm)
