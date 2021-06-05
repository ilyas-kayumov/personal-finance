import React from "react";
import { FieldsDataSource } from "./FieldsDataSource";
import '../App.css';
import { DataEvent } from "../data/DataEvent";
import { FieldData } from "./FieldData";
import { Locale } from "../Locale";

export interface FieldProps { id: string, dataSource: FieldsDataSource, onChange: Function, onBlur: Function };
interface FieldState { id: string, value: string, alert: string, type: string, styleClass: string };

export class Field extends React.Component<FieldProps, FieldState> {
    constructor(props: FieldProps) {
        super(props);
        let data = props.dataSource.getField(props.id);
        this.state = { id: data.id, value: data.value, alert: data.alert, type: data.type, styleClass: 'form-control' };
    }

    onChangeData = (data: FieldData) => {
        if (this.state.value !== data.value) {
            this.onChangeValue(data);
        }

        if (this.state.alert !== data.alert) {
            this.onChangeAlert(data);
        }
    }

    onChangeValue = (data: FieldData) => {
        this.setState({ value: data.value });
    }

    onChangeAlert = (data: FieldData) => {
        this.setState({ alert: data.alert });
        if (data.alert.length > 0) {
            this.setState({ styleClass: 'form-control is-invalid' });
        }
        else {
            this.setState({ styleClass: 'form-control' });
        }
    }

    componentDidMount() {
        this.props.dataSource.addEventListener(DataEvent.Change, this.state.id, this.onChangeData);
    }

    componentWillUnmount() {
        this.props.dataSource.removeEventListener(DataEvent.Change, this.state.id);
    }

    onChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.onChange(e);
    }

    onBlur = (e: React.FormEvent<HTMLInputElement>) => {
        this.props.onBlur(e);
    }

    render() {
        let label: string = '';
        this.state.id.split(' ').forEach(str => {
            label += str[0].toUpperCase() + str.slice(1) + ' ';
        });
        return (
            <div className='form-group'>
                <label>{Locale.get(label.trimEnd())}</label>
                <input name={this.state.id} placeholder={Locale.get(label.trimEnd())} type={this.state.type} value={this.state.value} onChange={this.onChange} onBlur={this.onBlur} className={this.state.styleClass} autoComplete='new-password'/>
                <small className='text-danger'>{this.state.alert}</small>
            </div>
        );
    }
}