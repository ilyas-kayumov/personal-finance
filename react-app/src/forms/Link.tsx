import React, { Component } from 'react';
import { FormEventsHandler } from './FormEventsHandler';
import { Locale } from '../Locale';

export interface ButtonProps { name: string, eventsHandler: FormEventsHandler, href: string }

export class Link extends Component<ButtonProps, {}> {
    render() {
        return (
            <a className='btn btn-link'
                onMouseLeave={this.props.eventsHandler.onMouseLeave}
                onMouseUp={this.props.eventsHandler.onMouseUp}
                onMouseDown={this.props.eventsHandler.onMouseDown}
                href={Locale.getURL(this.props.href)}>
                {this.props.name}
            </a>
        );
    }
}