import { MiddlewareAPI } from "redux"

export interface ActionProps {
  id: string | number
  type: string
  payload: any
}
