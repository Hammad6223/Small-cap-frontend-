import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import HeaderCard from '../Common/Component/HeaderCard';
import { sendNotification, fetchNotifications } from '../../Redux/Slices/notificationSlice';

const tableColumns = [
  { name: 'Title', selector: (row) => row.title, sortable: true, wrap: true },
  { name: 'Message', selector: (row) => row.body, wrap: true, grow: 2 },
  { name: 'Sent', selector: (row) => row.sentCount, center: true },
  { name: 'Failed', selector: (row) => row.failureCount, center: true },
  { name: 'Date', selector: (row) => new Date(row.createdAt).toLocaleString(), center: true, wrap: true },
];

const Notifications = () => {
  const dispatch = useDispatch();
  const { submitting, loading, notifications } = useSelector((state) => state.notification);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    if (!window.confirm('Send this notification to all app users?')) return;
    dispatch(sendNotification({ title, body }))
      .unwrap()
      .then(() => {
        setTitle('');
        setBody('');
      })
      .catch(() => {});
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle="Push Notification" parent="Send Notification" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title="Send a Notification" />
              <Form className="form theme-form">
                <CardBody>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      placeholder="Notification title"
                      maxLength={100}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Message</Label>
                    <Input
                      type="textarea"
                      rows="4"
                      placeholder="Notification message"
                      maxLength={500}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </FormGroup>
                </CardBody>
                <CardFooter className="text-end">
                  <button
                    type="button"
                    className="btn btn-primary mx-1"
                    onClick={handleSend}
                    disabled={submitting || !title.trim() || !body.trim()}
                  >
                    {submitting ? 'Sending..' : 'Send'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-light mx-1"
                    onClick={() => {
                      setTitle('');
                      setBody('');
                    }}
                  >
                    Clear
                  </button>
                </CardFooter>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title="Sent History" />
              <CardBody>
                <DataTable
                  data={notifications}
                  columns={tableColumns}
                  striped
                  center
                  pagination
                  progressPending={loading}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Notifications;
