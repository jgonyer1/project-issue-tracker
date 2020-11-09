import { ProjectRepository } from "../data/projectRepository";
import { Project } from "../models/Project";
import { Issue } from "../models/Issue";
import { CreateProjectRequest } from "../requests/CreateProjectRequest";
import * as uuid from "uuid";
const projectRepository = new ProjectRepository();
export  async function getProjects(userId: string): Promise<Project[]>{
    return (await projectRepository.getProjects(userId)).map(dynamodbProjectItem => new Project(dynamodbProjectItem));
}

export  async function createProject(userId: string, createProjectRequest: CreateProjectRequest): Promise<Project>{
    const newProject = {
        id: uuid.v4(),
        name: createProjectRequest.name
    };
    return await projectRepository.createProject(userId, newProject);
}

export async function getProject(userId: string, projectId: string): Promise<Project>{
    const project = new Project( (await projectRepository.getProject(userId, projectId)));
    project.issues = (await projectRepository.getIssuesForProject(userId, projectId)).map(dynamoDBIssueItem => new Issue(dynamoDBIssueItem));
    return project;
}
