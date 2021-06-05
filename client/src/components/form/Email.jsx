import React from 'react';
import Form from 'react-bootstrap/Form';
import FormField from './FormField';

export default function Email(props) {
  return (
    <FormField name='Email' alert={props.alert}>
      <Form.Control size='sm' name='login' type='email' placeholder='Enter email' onChange={props.onChangeControl} />
    </FormField>);
}
