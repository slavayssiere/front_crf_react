import React from "react";
import { Jumbotron, PageHeader, Col } from "react-bootstrap";

export default class Test extends React.Component {
    constructor() {
        super();
        console.log("add test");
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <Col xs={8} xsOffset={2}>
                <Jumbotron>
                    <PageHeader>Example page header <small>Subtext for header</small></PageHeader>
                    <h1>Test!</h1>
                </Jumbotron>
            </Col>
        );
    }
}