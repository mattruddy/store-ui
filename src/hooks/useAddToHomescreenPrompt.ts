import { useState, useEffect } from "react"

/**
 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt handler
 * before a user is prompted to "install" a web site to a home screen on mobile.
 *
 * @deprecated Only supported on Chrome and Android Webview.
 */
export interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt: () => Promise<void>
}

type BeforeInstallPromptEventType = () => [
  BeforeInstallPromptEvent | undefined,
  () => Promise<void> | undefined
]

export const useAddToHomescreenPrompt: BeforeInstallPromptEventType = () => {
  const [displayPrompt, setDisplayPrompt] = useState<BeforeInstallPromptEvent>()

  const promptToInstall = () => {
    if (displayPrompt) {
      return displayPrompt.prompt()
    }

    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    )
  }

  useEffect(() => {
    const ready = (prompt: any) => {
      prompt.preventDefault()
      setDisplayPrompt(prompt)
    }

    window.addEventListener("beforeinstallprompt", ready)

    return () => {
      window.removeEventListener("beforeinstallprompt", ready)
    }
  }, [])

  return [displayPrompt, promptToInstall]
}
