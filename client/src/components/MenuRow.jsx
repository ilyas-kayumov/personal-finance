import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

export default class MenuRow extends React.Component {
  render() {
    return (
      <>
        <Col className="basic-col">
          <Button size="sm" block id={"edit-" + this.props.id} onClick={this.props.handleEdit}> Edit </Button>
        </Col>
        <Col className="basic-col">
          <Button size="sm" block id={"delete-" + this.props.id} onClick={this.props.handleDelete}> Delete </Button>
        </Col>
      </>);
  }
}
