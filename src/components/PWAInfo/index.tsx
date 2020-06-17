import React, { memo, useState } from "react"
import {
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonRouterLink,
} from "@ionic/react"
import { ShareUrl, FormItem } from "../"
import { PWA } from "../../util/types"
import ReactGA from "react-ga"

//@ts-ignore
import StarRatings from "react-star-ratings"
import { openOutline } from "ionicons/icons"
import { Axios } from "../../redux/Actions"
import CategoryOptions from "../CategoryOptions"
import ReactTagInput from "@pathofdev/react-tag-input"
import "./styles.css"
import { noSpecialChars, mdConverter } from "../../util"
import ReactMde from "react-mde"

interface ContainerProps {
  pwa: PWA
  isMyPwa: boolean
  isEdit?: boolean
  name?: string
  cat?: string
  desc?: string
  tags?: string[]
  setName?: (name: string) => void
  setCat?: (option: string) => void
  setDesc?: (description: string) => void
  setTags?: (tasg: string[]) => void
}

const PWAInfo: React.FC<ContainerProps> = ({
  pwa,
  isMyPwa,
  isEdit = false,
  name,
  cat,
  desc,
  tags,
  setName,
  setCat,
  setDesc,
  setTags,
}) => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

  const onInstall = () => {
    if (!isMyPwa) {
      ;(async () => await (await Axios()).post(`public/pwa/${pwa.appId}`))()
      ReactGA.event({
        category: "installed",
        action: pwa.name,
      })
    }
  }

  return (
    <>
      <div className="PWAInfoHeader">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img alt="icon" className="PWAInfoIcon" src={pwa.icon} />
          <div className="PWAInfoToolbar">
            {isEdit ? (
              <FormItem
                name="Name"
                value={name!}
                onChange={(e) => setName!(e.detail!.value)}
                maxLength={25}
                showError={!noSpecialChars(name!)}
                errorMessage="No special chars allowed"
              />
            ) : (
              <span style={{ padding: "8px", fontSize: "20px" }}>
                {pwa.name}
              </span>
            )}
            {isEdit ? (
              <FormItem name="Category" showError={false} errorMessage="">
                <CategoryOptions initValue={cat} onPress={setCat!} />
              </FormItem>
            ) : (
              <small style={{ padding: "8px" }}>{pwa.category}</small>
            )}
          </div>
        </div>
        <IonButton
          color="dark"
          fill="outline"
          href={pwa.link}
          target="_blank"
          onClick={onInstall}
        >
          FREE <IonIcon style={{ marginLeft: "10px" }} icon={openOutline} />
        </IonButton>
      </div>
      {pwa.username && (
        <div style={{ marginLeft: "8px", marginBottom: "10px" }}>
          <IonRouterLink routerLink={`/dev/${pwa.username}`}>
            Developer Info
          </IonRouterLink>
        </div>
      )}
      <div style={{ marginLeft: "10px" }}>
        <StarRatings
          rating={pwa.averageRating}
          starDimension="20px"
          starSpacing="2px"
        />
        <span style={{ marginLeft: "5px" }}>({pwa.ratingsCount})</span>
      </div>
      <div className="PWAShareContainer">
        <ShareUrl title={pwa.name} />
      </div>
      {isEdit ? (
        <FormItem name="Tags" showError={false} errorMessage="">
          <div style={{ padding: "10px", width: "100%" }}>
            <ReactTagInput
              tags={tags!}
              onChange={(newTags) => {
                setTags!(newTags)
              }}
              validator={(tag) => {
                return tag.length <= 30
              }}
              removeOnBackspace={true}
              maxTags={5}
              placeholder="Enter to add"
            />
          </div>
        </FormItem>
      ) : (
        <div style={{ padding: "10px" }}>
          {pwa.tags.map((x, i) => (
            <IonChip key={i}>
              <IonLabel>{x}</IonLabel>
            </IonChip>
          ))}
        </div>
      )}
      {isEdit ? (
        <FormItem
          name="Description"
          showError={!desc || desc.length > 1500}
          errorMessage="Description is required and max length is 1500 characters"
        >
          <div style={{ width: "100%", paddingTop: "16px" }}>
            <ReactMde
              value={desc}
              onChange={setDesc}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(md) =>
                Promise.resolve(mdConverter.makeHtml(desc!))
              }            />
          </div>
        </FormItem>
      ) : (
        <div
          className="bottom-line-border"
          style={{ padding: "16px", minHeight: "200px" }}
          dangerouslySetInnerHTML={{
            __html: mdConverter.makeHtml(pwa.description),
          }}
        />
      )}
    </>
  )
}

export default memo(PWAInfo)
