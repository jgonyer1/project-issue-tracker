import { Project } from '../models/Project';

export class ProjectRepository{
    async getProjects(): Promise<Project[]>{
        return [
            { name: "Project 1", userId: "jg" },
            { name: "Project 2", userId: "jg" }
        ];
    }

}