import React, { Component } from 'react';
import Select from 'react-select';
import { Locale } from './Locale';
import { Redirect } from 'react-router-dom';

class SelectLanguage extends Component<{}, { redirect: string } > {
    constructor(props:any) {
        super(props);
        this.state = { redirect: '' };
    }

    onChange = (option: any) => {
        if (option.value !== Locale.getLanguage()) {
            this.setState({ redirect: Locale.getLocaleURL(option.value) });
        }
    };

    render() {
        let redirect = <></>;
        if (this.state.redirect !== '') {
            redirect = <Redirect to={this.state.redirect} />;
        }

        let language = Locale.getLanguage();
        return (
            <div>
                {redirect}
                <Select value={{ value: language, label: language}} onChange={this.onChange} options={[{ value: 'English', label: 'English' }, { value: 'Español', label: 'Español' }, { value: 'Русский', label: 'Русский' }]} />
            </div>
        );
    }
}

export default SelectLanguage;