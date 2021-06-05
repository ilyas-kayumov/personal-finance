import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Email from './form/Email';
import Password from './form/Password';

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: '', password: '' };
  }

  onChangeControl = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  formSubmit = () => {
    this.props.onFormSubmit(this.state);
  }

  render() {
    return (
      <Form className='account-form'>
        <h1 class='account-header'>Register</h1>
        <Email onChangeControl={this.onChangeControl} alert={this.props.loginAlert}></Email>
        <Password onChangeControl={this.onChangeControl} alert={this.props.passwordAlert}></Password>
        <Container>
          <Row noGutters='true'>
            <Col size='sm' className='basic-col' md={3}>
              <Button block size='sm' variant='primary' onClick={this.formSubmit}>
                Register
              </Button>
            </Col >
            <Col className='basic-col' md={3}>
              <Button size='sm' block variant='link' onClick={this.props.onClickLogin}>
                Login
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>);
  }
}
