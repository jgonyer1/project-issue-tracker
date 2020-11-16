import { Issue } from './Issue'
export interface Project {
  id: string
  name: string,
  issues: Issue[]
}
