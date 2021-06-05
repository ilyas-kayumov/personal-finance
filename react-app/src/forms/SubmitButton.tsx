import React, { Component } from 'react';

export class SubmitButton extends Component<{ isLoading: boolean, name: string }, {}> {
    render() {
        return (
            <button name={this.props.name} type='submit' className='btn btn-primary' disabled={this.props.isLoading}>
                {this.props.isLoading ? 'Loading' : this.props.name}
            </button>
        );
    }
}