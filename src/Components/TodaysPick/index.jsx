import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';
import HeaderCard from '../Common/Component/HeaderCard';
import DataTableComponent from './DataTableComponent';

const DataTables = () => {
  return (
    <Fragment>
    <Breadcrumbs mainTitle="Today's Pick" parent="View Today's Pick"  />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title="View Today's Pick" />
              <CardBody>
                <DataTableComponent />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default DataTables;