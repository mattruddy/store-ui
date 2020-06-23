import { useEffect, useState } from "react"
import Axios from "axios"

type GitHubType = (owner: string, repo: string) => any

export const useGitHubRepo: GitHubType = (owner: string, repo: string) => {
  const [gitHubData, setGitHubData] = useState<any>(undefined)
  useEffect(() => {
    if (owner !== undefined && repo !== undefined) {
      getData(owner, repo)
    }
  }, [owner, repo])

  const getData = async (owner: string, repo: string) => {
    try {
      const { data } = await Axios.request({
        url: `https://api.github.com/repos/${owner}/${repo}`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      setGitHubData(data)
    } catch (e) {
      console.log(e)
    }
  }

  return gitHubData
}
