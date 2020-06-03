import { rootReducer } from "./RootReducer"
import thunk from "redux-thunk"
import { createStore, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

const { NODE_ENV } = process.env

const storeFactory = () => {
  const inDevelopmentMode = NODE_ENV === "development"

  const middleWares = inDevelopmentMode
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

  const store = createStore(rootReducer, middleWares)

  return { store }
}

export default storeFactory
