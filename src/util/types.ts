export interface DispatchObject {
    [key: string]: any,
    type: string
}

export interface Image {
    imageId: number,
    url: string
}

export interface NewRating {
    averageStar: number,
    ratingCount: number,
    rating: Rating
}

export interface Rating {
    from: string,
    star: number,
    comment: string,
    createdAt: Date,
}

export interface PWA {
    appId: number
    name: string,
    description: string,
    link: string,
    icon: string,
    category: string,
    status: string,
    screenshots: Image[],
    reason: string,
    ratings: Rating[],
    averageRating: number,
    ratingsCount: number
}

export interface UserProfile {
    username: string,
    pwas: PWA[]
}

export interface Search {
    name: string,
    appId: number
}

type PromiseResolveValue<T> = T extends Promise<infer R> ? R : T;
type EffectType<T extends (...args: any) => any> = ReturnType<ReturnType<T>>;
type EffectReturnValue<T extends (...args: any) => any> = PromiseResolveValue<EffectType<T>>;
export type ActionType<T extends (...args: any) => any> = ReturnType<T> extends DispatchObject ? ReturnType<T> : EffectReturnValue<T>
  