import React, { memo } from "react"
import "./styles.css"

interface ContainerProps {
  children: any
  href: string
  target?: "_blank" | "_self" | "_parent" | "_top"
}

const ShareUrl: React.FC<ContainerProps> = ({ children, ...restOfProps }) => (
  <a className="ShareUrlLinks" {...restOfProps}>
    {children}
  </a>
)

export default memo(ShareUrl)
