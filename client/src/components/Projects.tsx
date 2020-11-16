import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Select,
  Placeholder,
  Dropdown
} from 'semantic-ui-react'

import { createProject, deleteTodo, getProjects, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Project } from '../types/Project'

interface ProjectsProps {
  auth: Auth
  history: History
}

interface ProjectsState {
  projects: Project[]
  newProjectName: string
  loadingProjects: boolean
}

export class Projects extends React.PureComponent<ProjectsProps, ProjectsState> {
  state: ProjectsState = {
    projects: [],
    newProjectName: '',
    loadingProjects: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProjectName: event.target.value })
  }


  onEditButtonClick = (projectId: string) => {
    this.props.history.push(`/projects/${projectId}`)
  }

  onProjectCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createProject(this.props.auth.getIdToken(), {
        name: this.state.newProjectName
      })
      this.setState({
        projects: [...this.state.projects, newTodo],
        newProjectName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  async componentDidMount() {
    try {
      const projects = await getProjects(this.props.auth.getIdToken())
      console.log(projects);
      this.setState({
        projects,
        loadingProjects: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New project',
              onClick: this.onProjectCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingProjects) {
      return this.renderLoading()
    }

    return this.renderProjectsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderProjectsList() {
    console.log(this.state);
    const options = this.state.projects.map(project => {return {text: project.name, value: project.id, key: project.id}});
    console.log(options);
    return (
      //"Hellow World"
      
      // <Dropdown selection options= {options} placeholder="Select a project"/>
        
      <Grid padded>
        {this.state.projects.map((project, pos) => {
          return (
            <Grid.Row key={project.id}>
              <Grid.Column width={10} verticalAlign="middle">
                {project.name}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(project.id)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
