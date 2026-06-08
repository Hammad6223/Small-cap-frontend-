import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import TextEditor from '../../CommonElements/TextEditor';
import { FaEye, FaEdit, FaTrash, FaPlus, FaRegFileAlt } from 'react-icons/fa';
import { fetchSections, addSection, updateSection, deleteSection } from '../../Redux/Slices/sectionSlice';

const emptyForm = { title: '', content: '' };

// Quill leaves "<p><br></p>" when empty, so work off the plain text.
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
const excerpt = (html, n = 140) => {
  const t = stripHtml(html);
  return t.length > n ? `${t.slice(0, n).trim()}…` : t;
};

const styles = `
  .sec-card{transition:transform .15s ease, box-shadow .15s ease;border:1px solid #eef0f3;border-radius:12px;overflow:hidden;height:100%;display:flex;flex-direction:column;}
  .sec-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(17,24,39,.10);}
  .sec-title{min-height:24px;}
  .sec-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .sec-clamp-4{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;}
  .sec-action{cursor:pointer;transition:opacity .15s ease;} .sec-action:hover{opacity:.6;}
`;

const Sections = () => {
  const dispatch = useDispatch();
  const { sections, loading, submitting } = useSelector((state) => state.section);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [viewItem, setViewItem] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchSections());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((s) => (s.title || '').toLowerCase().includes(q));
  }, [sections, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    setForm({ title: row.title || '', content: row.content || '' });
    setModalOpen(true);
  };

  const openView = (row) => setViewItem(row);

  const formValid = form.title.trim() && stripHtml(form.content);

  const handleSubmit = () => {
    if (!formValid) return;
    const action = editId ? updateSection({ id: editId, data: form }) : addSection(form);
    dispatch(action).unwrap().then(() => setModalOpen(false)).catch(() => {});
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this section?')) return;
    dispatch(deleteSection(row._id));
  };

  return (
    <Fragment>
      <style>{styles}</style>
      <Breadcrumbs mainTitle="Sections" parent="Sections" title="Manage Sections" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* Toolbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ gap: 12 }}>
                  <h5 className="mb-0">Sections</h5>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <Input
                      type="text"
                      placeholder="Search by title…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ minWidth: 220 }}
                    />
                    <button className="btn btn-primary d-flex align-items-center" style={{ gap: 8, whiteSpace: 'nowrap' }} onClick={openAdd}>
                      <FaPlus /> Add Section
                    </button>
                  </div>
                </div>

                {/* Grid / states */}
                {loading ? (
                  <div className="d-flex justify-content-center py-5"><Spinner color="primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaRegFileAlt size={42} className="mb-3" style={{ opacity: 0.4 }} />
                    <p className="mb-3">{search ? 'No section matches your search.' : 'No sections yet.'}</p>
                    {!search && (
                      <button className="btn btn-outline-primary d-inline-flex align-items-center" style={{ gap: 8 }} onClick={openAdd}>
                        <FaPlus /> Add your first section
                      </button>
                    )}
                  </div>
                ) : (
                  <Row className="g-4">
                    {filtered.map((row) => (
                      <Col key={row._id} xl="3" lg="4" md="6" sm="12">
                        <div className="sec-card">
                          <div className="p-3 d-flex flex-column" style={{ flex: '1 1 auto' }}>
                            <h6 className="sec-clamp-2 sec-title mb-2" style={{ fontWeight: 600 }}>{row.title}</h6>
                            <p className="sec-clamp-4 text-muted mb-3" style={{ fontSize: 13, flexGrow: 1, whiteSpace: 'pre-wrap' }}>{excerpt(row.content)}</p>
                            <div className="d-flex justify-content-end align-items-center" style={{ gap: 16, borderTop: '1px solid #f1f2f4', paddingTop: 12 }}>
                              <FaEye className="sec-action" title="View" style={{ fontSize: 17, color: '#2a9d8f' }} onClick={() => openView(row)} />
                              <FaEdit className="sec-action" title="Edit" style={{ fontSize: 17, color: '#3b82f6' }} onClick={() => openEdit(row)} />
                              <FaTrash className="sec-action" title="Delete" style={{ fontSize: 15, color: '#ef4444' }} onClick={() => handleDelete(row)} />
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
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{editId ? 'Edit Section' : 'Add Section'}</ModalHeader>
        <ModalBody>
          <Form className="form theme-form">
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Section title"
                maxLength={200}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <TextEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
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
        <ModalHeader toggle={() => setViewItem(null)}>Section Detail</ModalHeader>
        <ModalBody>
          {viewItem && (
            <article>
              <h3 style={{ marginBottom: 16 }}>{viewItem.title}</h3>
              <hr style={{ marginBottom: 18 }} />
              <div style={{ color: '#374151', lineHeight: 1.75, fontSize: 15 }} dangerouslySetInnerHTML={{ __html: viewItem.content || '' }} />
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

export default Sections;
