import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Password from './form/Password';
import Email from './form/Email';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { login: '', loginAlert: '', password: '', passwordAlert: '' };
  }

  onChangeControl = e => {
    this.setState({ [e.target.name]: e.target.value });

    console.trace('login ' + this.state.login);
  }

  onSubmit = e => {
    e.preventDefault();
    let hasErrors = false; 
    const msg = 'This is a required field';

    if (this.state.login === '') {
      this.setState({ loginAlert : msg });
      hasErrors = true;
    }

    if (this.state.password === '') {
      this.setState({ passwordAlert : msg });
      hasErrors = true;
    }

    if (!hasErrors) {
      this.props.onFormSubmit(this.state);
    }
  }

  render() {
    return (
      <Form className='account-form' onSubmit={this.onSubmit}>
        <h1 class='account-header'>Login</h1>
        <Email onChangeControl={this.onChangeControl} alert={this.state.loginAlert} />
        <Password onChangeControl={this.onChangeControl} alert={this.state.passwordAlert} />
        <Container>
          <Row noGutters='true'>
            <Col className='basic-col' md={3}>
              <Button block size='sm' type='submit' variant='primary'>
                Login
              </Button>
            </Col>
            <Col className='basic-col' md={3}>
              <Button block size='sm' variant='link' onClick={this.props.onClickRegister}>
                Register
              </Button>
            </Col>
          </Row>
          <Row className='basic-col'>
            <Button block size='sm' variant='link' onClick={this.props.onClickForgot}>
              Forgot your password?
            </Button>
          </Row>
        </Container>
      </Form>);
  }
}
