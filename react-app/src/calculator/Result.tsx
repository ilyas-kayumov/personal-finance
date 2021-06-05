import React, { Component } from 'react';

class Result extends Component<{ label: string, formatter: any, value: number }, {}> {
    render() {
        return (
            <div>
                <label>{this.props.label}: &nbsp;</label>
                <label><strong>{Number.isNaN(this.props.value) ? '-' : this.props.formatter.format(this.props.value)}</strong></label>
            </div>
        );
    }
}

export default Result;