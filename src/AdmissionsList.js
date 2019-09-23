import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link, withRouter } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class AdmissionsList extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {admissions: [], csrfToken: cookies.get('XSRF-TOKEN'), isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('admissions	', {credentials: 'include'})
      .then(response => response.json())
      .then(data => this.setState({admissions: data, isLoading: false}))
      .catch(() => this.props.history.push('/'));
  }

  async remove(id) {
  await fetch(`admissions/${id}`, {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': this.state.csrfToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(() => {
      let updatedAdmissions = [...this.state.admissions].filter(i => i.id !== id);
	  console.log(id);
      this.setState({admissions: updatedAdmissions});
    });
  }

  render() {
    const {admissions, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const admissionsList = admissions.map(admission => {
      return <tr key={admission.id}>
		<td>{admission.patient.name}</td>
        <td>{admission.patient.dob}</td>
        <td>{admission.patient.sex.name}</td>
		<td>{admission.admissionDate}</td>
		<td>{admission.category.categoryName}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/admissions/" + admission.id}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(admission.id)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/admissions">Add Admission</Button>
          </div>
          <h3>Admissions List</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Name</th>
              <th width="20%">Date of Birth</th>
			  <th width="20%">Sex</th>
			  <th width="20%">Date of Admission</th>
			  <th width="20%">Category</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {admissionsList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default withCookies(withRouter(AdmissionsList));