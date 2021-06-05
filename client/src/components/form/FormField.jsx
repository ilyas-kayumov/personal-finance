import React from 'react';
import Form from 'react-bootstrap/Form';

export default function FormField(props) {
  return (
    <Form.Group>
      <Form.Label size='sm'>{props.name}</Form.Label>
      {props.children}
      <Form.Text className='account-text'>{props.alert}</Form.Text>
    </Form.Group>);
}
