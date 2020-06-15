import React, { memo } from "react"
import { IonIcon } from "@ionic/react"
import "./styles.css"

interface ContainerProps {
  url: string | undefined
  logo: string
  className?: string
}

const LinkItem: React.FC<ContainerProps> = ({ url, logo, className }) => {
  return url ? (
    <a
      href={url}
      target="_blank"
      className={`ProfileLink ${className && className}`}
    >
      <IonIcon className="ProfileLinkIcon" icon={logo} />
    </a>
  ) : (
    <></>
  )
}

export default memo(LinkItem)
