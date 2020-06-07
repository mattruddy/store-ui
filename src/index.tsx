import "./css/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import storeFactory from "./redux"
import { Provider } from "react-redux"
import * as serviceWorker from "./serviceWorker"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { setupConfig } from "@ionic/core"
import App from "./App"
const { store } = storeFactory()

export type Store = typeof store

setupConfig({
  swipeBackEnabled: false,
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register(store)
defineCustomElements(window)
