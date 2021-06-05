import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import AccountAPI from '../api/AccountAPI';

export default class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = { screen: 'emailForm', email: '', verificationCode: '', newPassword: '' };
        this.onClick = this.onClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    async onClick(e) {
        let nextScreen;

        switch (this.state.screen) {
            case 'emailForm':
                await AccountAPI.sendVerificationCode(this.state.email);
                nextScreen = 'confirmationPasswordForm';
                break;
            case 'confirmationPasswordForm':
                await AccountAPI.verifyEmail({ email: this.state.email, verificationCode: this.state.verificationCode });
                nextScreen = 'newPasswordForm';
                break;
            case 'newPasswordForm':
                await AccountAPI.resetPassword({ email: this.state.email, newPassword: this.state.newPassword });
                nextScreen = 'newPasswordForm';
                this.props.passwordChangeEnd();
                break;
            default:
                break;
        }

        this.setState({ screen: nextScreen});
    }

    render() {
        let form;
        switch (this.state.screen) {
            case 'emailForm':
                form =
                    <Form className='account-form'>
                        <h1 class='account-header'>Password Reset</h1>
                        <Form.Group>
                            <Form.Label size='sm' >Email address</Form.Label>
                            <Form.Control size='sm' name='email' type='email' placeholder='Enter email' onChange={this.handleChange} />
                        </Form.Group>
                        <Container>
                            <Row noGutters='true'>
                                <Col className='basic-col' md={3}>
                                    <Button block size='sm' variant='primary' onClick={this.onClick}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                break;
            case 'confirmationPasswordForm':
                form =
                    <Form className='account-form'>
                        <h1 class='account-header'>Password Reset</h1>
                        <Form.Group>
                            <Form.Label size='sm'>Confirmation code</Form.Label>
                            <Form.Control size='sm' name='verificationCode' type='password' placeholder='Password' autoComplete='new-password' onChange={this.handleChange} />
                        </Form.Group>
                        <Container>
                            <Row noGutters='true'>
                                <Col className='basic-col' md={3}>
                                    <Button block size='sm' variant='primary' onClick={this.onClick}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                break;
            case 'newPasswordForm':
                form =
                    <Form className='account-form'>
                        <h1 class='account-header'>Password Reset</h1>
                        <Form.Group>
                            <Form.Label size='sm'>New Password</Form.Label>
                            <Form.Control size='sm' name='newPassword' type='password' placeholder='Password' autoComplete='new-password' onChange={this.handleChange} />
                        </Form.Group>
                        <Container>
                            <Row noGutters='true'>
                                <Col className='basic-col' md={3}>
                                    <Button block size='sm' variant='primary' onClick={this.onClick}>
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                break;
            default:
                break;
        }

        return form;
    }
}