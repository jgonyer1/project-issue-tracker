import { ProjectRepository } from "../data/projectRepository";
import { Project } from "../models/Project";
import { Issue } from "../models/Issue";
import { createLogger } from '../utils/logger';
import { CreateProjectRequest } from "../requests/CreateProjectRequest";
import { CreateIssueRequest } from "../requests/CreateIssueRequest";
import * as uuid from "uuid";
import { UpdateIssueRequest } from "../requests/UpdateIssueRequest";


const projectRepository = new ProjectRepository();
const logger = createLogger("Project Service");
export  async function getProjects(userId: string): Promise<Project[]>{
    return (await projectRepository.getProjects(userId)).map(dynamodbProjectItem => new Project(dynamodbProjectItem));
}

export  async function createProject(userId: string, createProjectRequest: CreateProjectRequest): Promise<Project>{
    const newProject = {
        id: uuid.v4(),
        name: createProjectRequest.name,
        determineNextIssueNumber: null
    };
    return await projectRepository.createProject(userId, newProject);
}

export async function getProject(userId: string, projectId: string): Promise<Project>{
    const dbProjectItem = await projectRepository.getProject(userId, projectId);
    logger.info("Got this back from db: ", dbProjectItem);
    const project = new Project(dbProjectItem);
    project.issues = (await projectRepository.getIssuesForProject(userId, projectId)).map(dynamoDBIssueItem => new Issue(dynamoDBIssueItem));
    return project;
}

export  async function createIssue(userId: string, createIssueRequest: CreateIssueRequest): Promise<Issue>{
    const parentProject = await getProject(userId, createIssueRequest.projectId)

    const newIssue = {
        id: `${createIssueRequest.projectId}_${uuid.v4()}`,
        issueNumber: parentProject.determineNextIssueNumber(),
        type: createIssueRequest.type,
        status: createIssueRequest.status,
        description: createIssueRequest.description
    };
    return await projectRepository.createIssue(userId, newIssue);
}

export async function updateIssue(userId: string, updateIssueRequest: UpdateIssueRequest): Promise<any>{
    return projectRepository.updateIssue(userId, updateIssueRequest);
}