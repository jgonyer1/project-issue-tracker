import { Issue } from "./Issue";
export interface Project {
    userId: string
    issues?: Array<Issue>,
    description?: string,
    name: string
  }
  