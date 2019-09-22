import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';

class AdmissionEdit extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  emptyItem = {
	admissionId: '',
    patientName: '',
    patientDOB: '',
    patientSex: '',
    admissionDate: '',
    category: ''
  };

  constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {
      item: this.emptyItem,
      csrfToken: cookies.get('XSRF-TOKEN')
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      try {
        const admission = await (await fetch(`/admissions`, {credentials: 'include'})).json();
        this.setState({item: admission});
      } catch (error) {
        this.props.history.push('/');
      }
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item, csrfToken} = this.state;

    await fetch('/admissions', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'X-XSRF-TOKEN': this.state.csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
      credentials: 'include'
    });
    this.props.history.push('/admissions');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Admission' : 'Add Admission'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
		  <FormGroup>
            <Label for="name">AdmissionID</Label>
            <Input type="text" name="id" id="id" value={item.admissionId || ''}
                   onChange={this.handleChange} autoComplete="admissionId"/>
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.patientName || ''}
                   onChange={this.handleChange} autoComplete="patientName"/>
          </FormGroup>
          <FormGroup>
            <Label for="DOB">DOB</Label>
            <Input type="Date" name="DOB" id="DOB" value={item.patientDOB || ''}
                   onChange={this.handleChange} autoComplete="patientDOB"/>
          </FormGroup>
          <FormGroup>
            <Label for="Sex">Sex</Label>
            <Input type="select" name="Sex" id="Sex" value={item.patientSex || ''}
                   onChange={this.handleChange} autoComplete="patientSex"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/groups">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withCookies(withRouter(AdmissionEdit));
