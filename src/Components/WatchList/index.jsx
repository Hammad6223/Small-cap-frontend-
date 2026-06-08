import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import { FaEye, FaEdit, FaTrash, FaPlus, FaRegListAlt, FaRegCalendarAlt, FaCheckSquare, FaCircle } from 'react-icons/fa';
import { fetchWatchLists, addWatchList, updateWatchList, deleteWatchList } from '../../Redux/Slices/watchlistSlice';

const emptyForm = { title: '', note: '', isLive: true, alerts: [], date: '' };

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const styles = `
  .wl-card{transition:transform .15s ease, box-shadow .15s ease;border:1px solid #eef0f3;border-radius:12px;overflow:hidden;height:100%;display:flex;flex-direction:column;}
  .wl-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(17,24,39,.10);}
  .wl-title{min-height:44px;}
  .wl-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .wl-live{display:inline-flex;align-items:center;gap:6px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:.5px;}
  .wl-action{cursor:pointer;transition:opacity .15s ease;} .wl-action:hover{opacity:.6;}
  .wl-alert-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid #eef0f3;border-radius:8px;margin-bottom:8px;background:#fafbfc;}
  .wl-view-alert{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;}
`;

const WatchList = () => {
  const dispatch = useDispatch();
  const { watchLists, loading, submitting } = useSelector((state) => state.watchlist);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newAlert, setNewAlert] = useState('');
  const [viewItem, setViewItem] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchWatchLists());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return watchLists;
    return watchLists.filter((w) => (w.title || '').toLowerCase().includes(q));
  }, [watchLists, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setNewAlert('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    setForm({
      title: row.title || '',
      note: row.note || '',
      isLive: row.isLive ?? true,
      alerts: Array.isArray(row.alerts) ? row.alerts : [],
      date: row.date ? row.date.substring(0, 10) : '',
    });
    setNewAlert('');
    setModalOpen(true);
  };

  const openView = (row) => setViewItem(row);

  const addAlert = () => {
    const t = newAlert.trim();
    if (!t) return;
    setForm({ ...form, alerts: [...form.alerts, t] });
    setNewAlert('');
  };

  const removeAlert = (i) => setForm({ ...form, alerts: form.alerts.filter((_, idx) => idx !== i) });

  const formValid = form.title.trim();

  const handleSubmit = () => {
    if (!formValid) return;
    const payload = { ...form, date: form.date || undefined };
    const action = editId ? updateWatchList({ id: editId, data: payload }) : addWatchList(payload);
    dispatch(action).unwrap().then(() => setModalOpen(false)).catch(() => {});
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this watch list?')) return;
    dispatch(deleteWatchList(row._id));
  };

  return (
    <Fragment>
      <style>{styles}</style>
      <Breadcrumbs mainTitle="Watch List" parent="Watch List" title="Manage Watch List" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* Toolbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ gap: 12 }}>
                  <h5 className="mb-0">Watch Lists</h5>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <Input
                      type="text"
                      placeholder="Search by title…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ minWidth: 220 }}
                    />
                    <button className="btn btn-primary d-flex align-items-center" style={{ gap: 8, whiteSpace: 'nowrap' }} onClick={openAdd}>
                      <FaPlus /> Add Watch List
                    </button>
                  </div>
                </div>

                {/* Grid / states */}
                {loading ? (
                  <div className="d-flex justify-content-center py-5"><Spinner color="primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaRegListAlt size={42} className="mb-3" style={{ opacity: 0.4 }} />
                    <p className="mb-3">{search ? 'No watch list matches your search.' : 'No watch lists yet.'}</p>
                    {!search && (
                      <button className="btn btn-outline-primary d-inline-flex align-items-center" style={{ gap: 8 }} onClick={openAdd}>
                        <FaPlus /> Add your first watch list
                      </button>
                    )}
                  </div>
                ) : (
                  <Row className="g-4">
                    {filtered.map((row) => (
                      <Col key={row._id} xl="3" lg="4" md="6" sm="12">
                        <div className="wl-card">
                          <div className="p-3 d-flex flex-column" style={{ flex: '1 1 auto' }}>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              {row.isLive ? <span className="wl-live"><FaCircle size={7} /> LIVE</span> : <span />}
                              {row.date && <small className="text-muted d-flex align-items-center" style={{ gap: 5 }}><FaRegCalendarAlt size={11} /> {formatDate(row.date)}</small>}
                            </div>
                            <h6 className="wl-clamp-2 wl-title mb-2" style={{ fontWeight: 600 }}>{row.title}</h6>
                            <p className="text-muted mb-3" style={{ fontSize: 13, flexGrow: 1 }}>
                              {(row.alerts?.length || 0)} alert{(row.alerts?.length || 0) === 1 ? '' : 's'}
                            </p>
                            <div className="d-flex justify-content-end align-items-center" style={{ gap: 16, borderTop: '1px solid #f1f2f4', paddingTop: 12 }}>
                              <FaEye className="wl-action" title="View" style={{ fontSize: 17, color: '#2a9d8f' }} onClick={() => openView(row)} />
                              <FaEdit className="wl-action" title="Edit" style={{ fontSize: 17, color: '#3b82f6' }} onClick={() => openEdit(row)} />
                              <FaTrash className="wl-action" title="Delete" style={{ fontSize: 15, color: '#ef4444' }} onClick={() => handleDelete(row)} />
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add / Edit modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered size="lg">
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{editId ? 'Edit Watch List' : 'Add Watch List'}</ModalHeader>
        <ModalBody>
          <Form className="form theme-form">
            <Row>
              <Col md="8">
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Pro Ticker Daily Watch List - Monday June 8th 2026"
                    maxLength={250}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Note (optional)</Label>
              <Input
                type="textarea"
                rows="2"
                placeholder="e.g. (We post alerts in REAL TIME—stay in the app and refresh to see them FIRST)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label className="d-flex align-items-center" style={{ gap: 8, cursor: 'pointer', width: 'fit-content' }}>
                <input
                  type="checkbox"
                  checked={form.isLive}
                  onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                Show LIVE badge
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>Alerts</Label>
              <div className="d-flex" style={{ gap: 8 }}>
                <Input
                  type="text"
                  placeholder="e.g. SUNE Long > 2.1 Short < 1.18 - 7:24 AM ET"
                  value={newAlert}
                  onChange={(e) => setNewAlert(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAlert(); } }}
                />
                <button type="button" className="btn btn-primary d-flex align-items-center" style={{ gap: 6, whiteSpace: 'nowrap' }} onClick={addAlert}>
                  <FaPlus /> Add
                </button>
              </div>
              <small className="text-muted">Press Enter or click Add to append a line.</small>

              <div className="mt-3">
                {form.alerts.length === 0 ? (
                  <div className="text-muted" style={{ fontSize: 13 }}>No alerts added yet.</div>
                ) : (
                  form.alerts.map((a, i) => (
                    <div className="wl-alert-row" key={i}>
                      <FaCheckSquare style={{ color: '#16a34a', flexShrink: 0 }} />
                      <span style={{ flexGrow: 1, fontSize: 14 }}>{a}</span>
                      <FaTrash className="wl-action" title="Remove" style={{ color: '#ef4444', flexShrink: 0 }} onClick={() => removeAlert(i)} />
                    </div>
                  ))
                )}
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !formValid}>
            {submitting ? 'Saving..' : editId ? 'Update' : 'Save'}
          </button>
        </ModalFooter>
      </Modal>

      {/* View modal */}
      <Modal isOpen={!!viewItem} toggle={() => setViewItem(null)} centered size="lg">
        <ModalHeader toggle={() => setViewItem(null)}>Watch List Detail</ModalHeader>
        <ModalBody>
          {viewItem && (
            <article>
              <div className="d-flex align-items-center justify-content-between mb-3">
                {viewItem.isLive ? <span className="wl-live"><FaCircle size={7} /> LIVE</span> : <span />}
                {viewItem.date && <small className="text-muted d-flex align-items-center" style={{ gap: 5 }}><FaRegCalendarAlt size={12} /> {formatDate(viewItem.date)}</small>}
              </div>
              <h4 style={{ marginBottom: 10 }}>{viewItem.title}</h4>
              {viewItem.note && <p className="text-muted" style={{ marginBottom: 18 }}>{viewItem.note}</p>}
              <hr style={{ marginBottom: 14 }} />
              {(!viewItem.alerts || viewItem.alerts.length === 0) ? (
                <div className="text-muted">No alerts.</div>
              ) : (
                viewItem.alerts.map((a, i) => (
                  <div className="wl-view-alert" key={i}>
                    <FaCheckSquare style={{ color: '#16a34a', marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, lineHeight: 1.5 }}>{a}</span>
                  </div>
                ))
              )}
            </article>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light" onClick={() => setViewItem(null)}>Close</button>
          <button className="btn btn-primary d-inline-flex align-items-center" style={{ gap: 8 }} onClick={() => { openEdit(viewItem); setViewItem(null); }}>
            <FaEdit /> Edit
          </button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default WatchList;
