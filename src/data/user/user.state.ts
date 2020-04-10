export interface UserState {
    isLoggedIn: boolean;
    token?: string;
    loading: boolean;
    hasRead?: string;
};