import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css/Styles.css';

export default class Header extends React.Component {
    render() {
        let logout = this.props.logged ? <Button size="sm" variant="outline-light" onClick={this.props.onClickLogout}>Logout</Button> : <></>;
        let login = this.props.logged ? <Form.Label size="sm" variant="light" className='header-login-text'> <strong>{this.props.login.split('@')[0]}</strong> </Form.Label> : <></>;
        return (
            <Navbar bg="primary" variant="dark" expand="lg">
                <Navbar.Brand>Multi-currency Finance</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    <Form inline>
                        {login}
                        {logout}
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}