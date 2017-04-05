import React from "react";
import { Jumbotron } from "react-bootstrap";

export default class NoMatch extends React.Component {
    constructor() {
        super();
        console.log("add nomatch");
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <Jumbotron>
                <h1>404</h1>
            </Jumbotron>
        );
    }
}