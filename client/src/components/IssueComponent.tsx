import * as React from 'react'
import Auth from '../auth/Auth'
import { Card, Grid, StrictPaginationItemProps } from 'semantic-ui-react'
import { Issue } from '../types/Issue';
import { Link } from 'react-router-dom'

interface IssueComponentProps {
  issue: Issue,
  auth: Auth
}

interface IssueComponentState {
    id: string
    type: string
    status: string
    issueNumber: string
    description: string,
    typeOptions: Array<string>
}



export class IssueComponent extends React.Component<IssueComponentProps, IssueComponentState> {
  constructor(props: IssueComponentProps){
    super(props);

    this.state = {
      id: props.issue.id,
      description: props.issue.description,
      type: props.issue.type,
      status: props.issue.status,
      issueNumber: props.issue.issueNumber,
      typeOptions: ["Feature","Defect","Research"]
    };
  } 

  async componentDidMount() {
    
  }

  handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      type: event.target.value,
    });
    console.log(`Current Issue Type ${this.props.issue.type}`);
    console.log(`Select value: ${event.target.value}`);
    console.log(`Changed Type To ${this.state.type}`);
    
  };

  render() {
    return (
      <tr>
        <td>{this.state.issueNumber}</td>
        <td>{this.state.description}</td>
        <td>
        <select name='selectedType' onChange={this.handleChangeType}>
            {this.state.typeOptions.map(option => option === this.state.type ? 
            (<option value={option} selected key={option} >{option}</option>) :
            (<option value={option} key={option}>{option}</option>))}        
          </select>
        </td>
        <td>{this.state.status}</td>
      </tr>
    )
  }
}