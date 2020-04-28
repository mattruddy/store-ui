import axios from 'axios'

const AxiosCors = (baseURL: string) =>
    axios.create({
        withCredentials: false,
        baseURL,
        // can try this for now. =D
        //@ts-ignore
        crossDomain: true,
        mode: 'cors',
        responseType: 'json'
    })

export { AxiosCors }