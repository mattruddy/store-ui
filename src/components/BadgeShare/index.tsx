import React, { memo } from "react"
import { IonIcon } from "@ionic/react"
import { copy } from "ionicons/icons"
import "./styles.css"
import { copyStringToClipboard } from "../../util"

interface ContainerProps {
  url: string
  name: string
}

const BadgeShare: React.FC<ContainerProps> = ({ url, name }) => {
  const badgeUrl = `<img src="https://img.shields.io/static/v1?&message=ProgressiveApp.Store&color=74b9ff&style=flat&label=Discover%20${name.replace(
    / /g,
    "%20"
  )}%20at" href="${url}/${name.replace(/ /g, "-")}" />`

  return (
    <>
      <h3 className="PWACardContent">Add our Badge to Your Readme!</h3>
      <div className="PWACardContent" style={{ padding: "8px" }}>
        <span
          className="line-left-round-full copy-box"
          style={{ width: "90%" }}
        >
          <input
            className="copy-box"
            style={{
              padding: "4px",
              background: "transparent",
              border: "none",
              color: "var(--text-color)",
              width: "100%",
            }}
            value={badgeUrl}
          />
        </span>
        <span className="line-c-right-round copy-box" style={{ width: "32px" }}>
          <button
            style={{ background: "transparent", padding: "4px" }}
            className="sub-color copy-box"
            onClick={() => copyStringToClipboard(badgeUrl)}
          >
            <IonIcon icon={copy} size="small" />
          </button>
        </span>
      </div>
      <div className="PWACardContent">
        <img
          src={`https://img.shields.io/static/v1?&message=ProgressiveApp.Store&color=74b9ff&style=flat&label=Discover%20${name.replace(
            / /g,
            "%20"
          )}%20at`}
        />
      </div>
    </>
  )
}

export default memo(BadgeShare)
