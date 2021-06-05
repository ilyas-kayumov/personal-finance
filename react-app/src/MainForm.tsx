import React, { Component } from 'react';
import { TokenDataSource } from './TokenDataSource';
import BalanceProxy from './balance/BalanceProxy';
import { LoginForm } from './forms/LoginForm';

class MainForm extends Component {
    render() {
        let token = TokenDataSource.getInstance().get() ?? '';
        return (
            token.length > 0 ? <BalanceProxy /> : <LoginForm /> 
        );
    }
}

export default MainForm;