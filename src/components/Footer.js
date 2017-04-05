import React from 'react';
import { Grid, Col } from 'react-bootstrap';

export default class Footer extends React.Component {
  constructor() {
    super();
    console.log("add footer");
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <footer>
        <Col xs={6} xsOffset={2}>
          <Grid>
            <div className="text-center small copyright">
              © RLM 2016
          </div>
          </Grid>
        </Col>
      </footer>
    );
  }
}