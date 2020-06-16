import React, { memo } from "react"
import { IonIcon } from "@ionic/react"
import "./styles.css"

interface ContainerProps {
  url: string | undefined
  logo: string
  className?: string
  color?: string
}

const LinkItem: React.FC<ContainerProps> = ({
  url,
  logo,
  className,
  color,
}) => {
  return url ? (
    <a
      href={url}
      target="_blank"
      className={`ProfileLink ${className && className}`}
    >
      <IonIcon
        color={`${color && color}`}
        className="ProfileLinkIcon"
        icon={logo}
      />
    </a>
  ) : (
    <></>
  )
}

export default memo(LinkItem)
