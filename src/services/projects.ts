import { ProjectRepository } from "../data/projectRepository";
const projectRepository = new ProjectRepository();
export  async function getProjects(userId: string){
    return projectRepository.getProjects(userId);
}