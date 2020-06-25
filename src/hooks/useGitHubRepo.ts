import { useEffect, useState } from "react"
import Axios from "axios"

export interface GithubRepo {
  owner: string
  repo: string
}

type GitHubType = (repoInfo?: GithubRepo) => any

export const useGitHubRepo: GitHubType = (repoInfo?) => {
  const [gitHubData, setGitHubData] = useState<any>(undefined)
  useEffect(() => {
    if (repoInfo !== undefined) {
      getData(repoInfo.owner, repoInfo.repo)
    }
  }, [repoInfo])

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

  return gitHubData || {}
}
