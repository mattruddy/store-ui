import { AxiosRequestConfig } from "axios"

export interface DispatchObject {
  [key: string]: any
  type: string
}

export interface Image {
  imageId: number
  url: string
}

export interface NewRating {
  averageStar: number
  ratingCount: number
  rating: Rating
}

export interface Rating {
  from: string
  star: number
  comment: string
  createdAt: Date
}

export interface PWA {
  appId: number
  name: string
  description: string
  link: string
  icon: string
  category: string
  status: string
  screenshots: Image[]
  reason: string
  ratings: Rating[]
  averageRating: number
  ratingsCount: number
  tags: string[]
}

export interface UserProfile {
  username: string
  email: string
  pwas: PWA[]
}

export interface HomePWAs {
  topApps: PWA[]
  newApps: PWA[]
  discoverApps: PWA[]
}

export interface Search {
  name: string
  appId: number
}

export interface Push {
  key: string
  auth: string
  endpoint: string
}

export interface StoreNotification {
  subject: string
  body?: string
  link?: string
  isRead: boolean
  isArchived: boolean
}

export interface AxiosCustomRequestConfig extends AxiosRequestConfig {
  crossDomain?: boolean
}

type PromiseResolveValue<T> = T extends Promise<infer R> ? R : T
type EffectType<T extends (...args: any) => any> = ReturnType<ReturnType<T>>
type EffectReturnValue<T extends (...args: any) => any> = PromiseResolveValue<
  EffectType<T>
>
export type ActionType<T extends (...args: any) => any> = ReturnType<
  T
> extends DispatchObject
  ? ReturnType<T>
  : EffectReturnValue<T>
