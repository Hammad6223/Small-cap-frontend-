import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import HeaderCard from '../Common/Component/HeaderCard';
import { sendNotification, fetchNotifications } from '../../Redux/Slices/notificationSlice';

// Each value is the app's screen/route name. The app must navigate to this
// name when a notification with data.screen === value is tapped.
const PAGE_OPTIONS = [
  { label: 'No specific page (just notify)', value: '' },
  { label: 'Home', value: 'Home' },
  { label: "Live Stocks (Today's Pick)", value: 'Picks' },
  { label: 'Top Gainers / Losers', value: 'Movers' },
  { label: 'Watchlist', value: 'Watchlist' },
];

const tableColumns = [
  { name: 'Title', selector: (row) => row.title, sortable: true, wrap: true },
  { name: 'Message', selector: (row) => row.body, wrap: true, grow: 2 },
  { name: 'Target', selector: (row) => row.data?.screen || '—', center: true, wrap: true },
  { name: 'Sent', selector: (row) => row.sentCount, center: true },
  { name: 'Failed', selector: (row) => row.failureCount, center: true },
  { name: 'Date', selector: (row) => new Date(row.createdAt).toLocaleString(), center: true, wrap: true },
];

const Notifications = () => {
  const dispatch = useDispatch();
  const { submitting, loading, notifications } = useSelector((state) => state.notification);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [screen, setScreen] = useState('');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setScreen('');
  };

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    if (!window.confirm('Send this notification to all app users?')) return;
    dispatch(sendNotification({ title, body, screen }))
      .unwrap()
      .then(resetForm)
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
                  <FormGroup>
                    <Label>Target Page</Label>
                    <Input type="select" value={screen} onChange={(e) => setScreen(e.target.value)}>
                      {PAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Input>
                    <small className="text-muted">Where the app opens when the user taps this notification.</small>
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
                  <button type="button" className="btn btn-light mx-1" onClick={resetForm}>
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
