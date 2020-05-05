import React, { memo } from "react"
import "./styles.css"

interface ContainerProps {
  children: any
  href: string
  target?: "_blank" | "_self" | "_parent" | "_top"
}

const ShareUrl: React.FC<ContainerProps> = ({ children, target, href }) => (
  <a className="ShareUrlLinks" href={href} target={target || "_blank"}>
    {children}
  </a>
)

export default memo(ShareUrl)
