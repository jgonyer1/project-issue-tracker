import * as React from 'react'
import { Form, Button, Grid, Icon, Dropdown, Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getProject } from '../api/todos-api';
import { Project } from '../types/Project';
import {IssueComponent}  from './IssueComponent';

const issueTypeOptions = [
  {
    key: "Feature"
  },
  {
    key: "Defect"
  },
  {
    key: "Task"
  }
];

interface EditProjectProps {
  match: {
    params: {
      projectId: string
    }
  }
  auth: Auth
}

interface EditProjectState {
  project: Project
  newIssueDescription: string,
  newIssueType: string,
  loadingProjects: boolean
}

export class EditProject extends React.PureComponent<
EditProjectProps,
EditProjectState
> {
  state: EditProjectState = {
    project: {id: "", name: "", issues: []},
    newIssueDescription: "",
    newIssueType: issueTypeOptions[0].key,
    loadingProjects: true
  }
  issueTypeOptions: Array<string> = ["Feature", "Defect", "Research"];
  statusOptions: Array<string> = ["Open", "In Progress", "Done"];

  async componentDidMount() {
    try {
      const project = await getProject(this.props.auth.getIdToken(), this.props.match.params.projectId)
      console.log(project);
      this.setState({
        project,
        loadingProjects: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

 
  onCreateIssue = async (event: any) => {
    const newStatus = this.statusOptions[0];

  };

  onChangeNewIssueDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newIssueDescription: event.target.value });
  }
  onChangeNewIssueType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ newIssueType: event.target.value });
  }

  render() {
    return (
      <table>
        <tbody>
        <tr>
            <td>
              <button type="button" onClick={this.onCreateIssue}>Create Issue</button>
              </td>
              <td>
                <input type="text" value={this.state.newIssueDescription} name="new-issue-description" onChange={this.onChangeNewIssueDescription} placeholder="New Issue Description..."></input>
              </td>
              <td>
              <select name='newIssueType' onChange={this.onChangeNewIssueType}>
            {this.issueTypeOptions.map(option => option === this.state.newIssueType ? 
            (<option value={option} selected key={option} >{option}</option>) :
            (<option value={option} key={option}>{option}</option>))}        
          </select>
              </td>
          </tr>
        </tbody>
      </table>>
      <table>
        <thead>
          <tr>
            <th colSpan={4}>
              Issues In Project: {this.state.project.name}
            </th>
          </tr>
          
          <tr>
            <th>
              Issue Number
            </th>
            <th>
              Description
            </th>
            <th>
              Type
            </th>
            <th>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
        {this.state.project.issues.map((issue) => { 
          return (<IssueComponent issue={ issue } key={ issue.id } auth={this.props.auth}/>)
        })}
        </tbody>
      </table>
    )
  }

  renderButton() {

    return (
      <div>
        
        
      </div>
    )
  }
}
