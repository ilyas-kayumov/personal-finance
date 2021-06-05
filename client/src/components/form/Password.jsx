import React from 'react';
import Form from 'react-bootstrap/Form';
import FormField from './FormField';

export default function Password(props) {
  return (
    <FormField name='Password' alert={props.alert}>
      <Form.Control size='sm' name='password' type='password' placeholder='Password' autoComplete='new-password' onChange={props.onChangeControl} />
    </FormField>);
}
