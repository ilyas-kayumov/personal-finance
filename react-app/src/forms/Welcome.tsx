import React from "react";
import { ServiceInfo } from "./ServiceInfo";
import { Helmet } from "react-helmet";
import { Locale } from "../Locale";

export function Welcome(props: any) {
    return (
        <div className="container main-container">
            <Helmet>
                <title>{Locale.get('Multi-currency Finance')}</title>
                <meta name="description" content={Locale.get('Main_description', false)} />
            </Helmet>
            <div className="row">
                <div className="col-md col-12">
                    <ServiceInfo />
                </div>
                <div className="col-md col-12">
                    {props.form}
                </div>
            </div>
        </div>);
}