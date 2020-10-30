import { ProjectRepository } from "../data/projectRepository";
const projectRepository = new ProjectRepository();
export  async function getProjects(){
    return projectRepository.getProjects();
}