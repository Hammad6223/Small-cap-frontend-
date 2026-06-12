import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import { FaEdit, FaTrash, FaPlus, FaRegImage } from 'react-icons/fa';
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '../../Redux/Slices/bannerSlice';

const emptyForm = { badge: '', title: '', subtitle: '', description: '' };

const styles = `
  .banner-card{border:1px solid #eef0f3;border-radius:12px;overflow:hidden;height:100%;display:flex;flex-direction:column;
    transition:transform .15s ease, box-shadow .15s ease;}
  .banner-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(17,24,39,.10);}
  .banner-preview{background:#2b2f36;color:#fff;padding:22px;position:relative;}
  .banner-badge{display:inline-block;border:1px solid #e0a23b;color:#e0a23b;font-size:11px;font-weight:700;
    letter-spacing:.5px;text-transform:uppercase;padding:5px 12px;border-radius:8px;margin-bottom:14px;}
  .banner-h1{font-size:22px;font-weight:800;margin:0 0 4px;}
  .banner-h2{font-size:18px;font-weight:800;color:#4aa3e0;margin:0 0 10px;text-transform:uppercase;}
  .banner-desc{font-size:13px;color:#c7ccd3;line-height:1.5;margin:0;}
  .banner-action{cursor:pointer;transition:opacity .15s ease;} .banner-action:hover{opacity:.6;}
`;

const Banner = () => {
  const dispatch = useDispatch();
  const { banners, loading, submitting } = useSelector((state) => state.banner);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchBanners());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return banners;
    return banners.filter((b) => (b.title || '').toLowerCase().includes(q));
  }, [banners, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    setForm({
      badge: row.badge || '',
      title: row.title || '',
      subtitle: row.subtitle || '',
      description: row.description || '',
    });
    setModalOpen(true);
  };

  const formValid = form.title.trim();

  const handleSubmit = () => {
    if (!formValid) return;
    const action = editId ? updateBanner({ id: editId, data: form }) : addBanner(form);
    dispatch(action).unwrap().then(() => setModalOpen(false)).catch(() => {});
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this banner?')) return;
    dispatch(deleteBanner(row._id));
  };

  return (
    <Fragment>
      <style>{styles}</style>
      <Breadcrumbs mainTitle="Banner" parent="Banner" title="Manage Banners" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* Toolbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ gap: 12 }}>
                  <h5 className="mb-0">Banners</h5>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <Input
                      type="text"
                      placeholder="Search by title…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ minWidth: 220 }}
                    />
                    <button className="btn btn-primary d-flex align-items-center" style={{ gap: 8, whiteSpace: 'nowrap' }} onClick={openAdd}>
                      <FaPlus /> Add Banner
                    </button>
                  </div>
                </div>

                {/* Grid / states */}
                {loading ? (
                  <div className="d-flex justify-content-center py-5"><Spinner color="primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaRegImage size={42} className="mb-3" style={{ opacity: 0.4 }} />
                    <p className="mb-3">{search ? 'No banners match your search.' : 'No banners yet.'}</p>
                    {!search && (
                      <button className="btn btn-outline-primary d-inline-flex align-items-center" style={{ gap: 8 }} onClick={openAdd}>
                        <FaPlus /> Add your first banner
                      </button>
                    )}
                  </div>
                ) : (
                  <Row className="g-4">
                    {filtered.map((row) => (
                      <Col key={row._id} xl="4" lg="6" md="6" sm="12">
                        <div className="banner-card">
                          <div className="banner-preview">
                            {row.badge && <span className="banner-badge">{row.badge}</span>}
                            <h3 className="banner-h1">{row.title}</h3>
                            {row.subtitle && <h4 className="banner-h2">{row.subtitle}</h4>}
                            {row.description && <p className="banner-desc">{row.description}</p>}
                          </div>
                          <div className="p-3 d-flex justify-content-end align-items-center" style={{ gap: 16 }}>
                            <FaEdit className="banner-action" title="Edit" style={{ fontSize: 17, color: '#3b82f6' }} onClick={() => openEdit(row)} />
                            <FaTrash className="banner-action" title="Delete" style={{ fontSize: 15, color: '#ef4444' }} onClick={() => handleDelete(row)} />
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
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{editId ? 'Edit Banner' : 'Add Banner'}</ModalHeader>
        <ModalBody>
          <Form className="form theme-form">
            <FormGroup>
              <Label>Badge Label</Label>
              <Input
                type="text"
                placeholder="e.g. SPONSORED EDITORIAL"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </FormGroup>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Title <span className="text-danger">*</span></Label>
                  <Input
                    type="text"
                    placeholder="e.g. (NASDAQ: BRAI)"
                    maxLength={200}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Subtitle</Label>
                  <Input
                    type="text"
                    placeholder="e.g. AI-POWERED PLATFORM"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                rows="4"
                placeholder="Short description shown under the title"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light" onClick={() => setModalOpen(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !formValid}
          >
            {submitting ? 'Saving..' : editId ? 'Update' : 'Save'}
          </button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Banner;
