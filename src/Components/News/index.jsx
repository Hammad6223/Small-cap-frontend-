import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import TextEditor from '../../CommonElements/TextEditor';
import { FaEye, FaEdit, FaTrash, FaPlus, FaRegNewspaper, FaRegCalendarAlt } from 'react-icons/fa';
import { fetchNews, addNews, updateNews, deleteNews } from '../../Redux/Slices/newsSlice';

const emptyForm = { title: '', content: '', date: '', image: null };

// Quill leaves "<p><br></p>" when empty, so work off the plain text.
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
const excerpt = (html, n = 110) => {
  const text = stripHtml(html);
  return text.length > n ? `${text.slice(0, n).trim()}…` : text;
};
const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const styles = `
  .news-card{transition:transform .15s ease, box-shadow .15s ease;border:1px solid #eef0f3;border-radius:12px;overflow:hidden;height:100%;}
  .news-card:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(17,24,39,.10);}
  .news-cover{position:relative;height:0;padding-top:58%;background:#f3f4f6;overflow:hidden;}
  .news-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
  .news-cover .news-cover-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#c4c9d2;}
  .news-date-pill{position:absolute;top:10px;left:10px;display:inline-flex;align-items:center;gap:6px;
    background:rgba(17,24,39,.72);color:#fff;font-size:11px;font-weight:600;padding:4px 9px;border-radius:999px;}
  .news-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .news-action{cursor:pointer;transition:opacity .15s ease;} .news-action:hover{opacity:.6;}
  .news-upload{border:1.5px dashed #d4d8de;border-radius:10px;padding:16px;text-align:center;background:#fafbfc;}
  .news-content{color:#374151;line-height:1.75;font-size:15px;}
  .news-content img{max-width:100%;border-radius:8px;}
`;

const News = () => {
  const dispatch = useDispatch();
  const { news, loading, submitting } = useSelector((state) => state.news);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchNews());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return news;
    return news.filter((n) => (n.title || '').toLowerCase().includes(q));
  }, [news, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row._id);
    setForm({
      title: row.title || '',
      content: row.content || '',
      date: row.date ? row.date.substring(0, 10) : '',
      image: null,
    });
    setPreview(row.image?.url || null);
    setModalOpen(true);
  };

  const openView = (row) => setViewItem(row);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !stripHtml(form.content)) return;
    const action = editId ? updateNews({ id: editId, data: form }) : addNews(form);
    dispatch(action).unwrap().then(() => setModalOpen(false)).catch(() => {});
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this news article?')) return;
    dispatch(deleteNews(row._id));
  };

  return (
    <Fragment>
      <style>{styles}</style>
      <Breadcrumbs mainTitle="News" parent="News" title="Manage News" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* Toolbar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ gap: 12 }}>
                  <h5 className="mb-0">News Articles</h5>
                  <div className="d-flex align-items-center" style={{ gap: 10 }}>
                    <Input
                      type="text"
                      placeholder="Search by title…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ minWidth: 220 }}
                    />
                    <button className="btn btn-primary d-flex align-items-center" style={{ gap: 8, whiteSpace: 'nowrap' }} onClick={openAdd}>
                      <FaPlus /> Add News
                    </button>
                  </div>
                </div>

                {/* Grid / states */}
                {loading ? (
                  <div className="d-flex justify-content-center py-5"><Spinner color="primary" /></div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FaRegNewspaper size={42} className="mb-3" style={{ opacity: 0.4 }} />
                    <p className="mb-3">{search ? 'No news matches your search.' : 'No news articles yet.'}</p>
                    {!search && (
                      <button className="btn btn-outline-primary d-inline-flex align-items-center" style={{ gap: 8 }} onClick={openAdd}>
                        <FaPlus /> Add your first article
                      </button>
                    )}
                  </div>
                ) : (
                  <Row className="g-4">
                    {filtered.map((row) => (
                      <Col key={row._id} xl="3" lg="4" md="6" sm="12">
                        <div className="news-card">
                          <div className="news-cover">
                            {row.image?.url ? (
                              <img src={row.image.url} alt={row.title} />
                            ) : (
                              <div className="news-cover-ph"><FaRegNewspaper size={40} /></div>
                            )}
                            {row.date && (
                              <span className="news-date-pill"><FaRegCalendarAlt size={11} /> {formatDate(row.date)}</span>
                            )}
                          </div>
                          <div className="p-3 d-flex flex-column" style={{ minHeight: 150 }}>
                            <h6 className="news-clamp-2 mb-2" style={{ fontWeight: 600 }}>{row.title}</h6>
                            <p className="text-muted mb-3" style={{ fontSize: 13, flexGrow: 1 }}>{excerpt(row.content)}</p>
                            <div className="d-flex justify-content-end align-items-center" style={{ gap: 16, borderTop: '1px solid #f1f2f4', paddingTop: 12 }}>
                              <FaEye className="news-action" title="View" style={{ fontSize: 17, color: '#2a9d8f' }} onClick={() => openView(row)} />
                              <FaEdit className="news-action" title="Edit" style={{ fontSize: 17, color: '#3b82f6' }} onClick={() => openEdit(row)} />
                              <FaTrash className="news-action" title="Delete" style={{ fontSize: 15, color: '#ef4444' }} onClick={() => handleDelete(row)} />
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
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>{editId ? 'Edit News' : 'Add News'}</ModalHeader>
        <ModalBody>
          <Form className="form theme-form">
            <Row>
              <Col md="7">
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    placeholder="News title"
                    maxLength={200}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md="5">
                <FormGroup>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Content</Label>
              <TextEditor value={form.content} onChange={(val) => setForm({ ...form, content: val })} />
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
              <div className="news-upload">
                {preview ? (
                  <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <div className="text-muted"><FaRegNewspaper size={26} className="mb-2" style={{ opacity: 0.5 }} /><div>No image selected</div></div>
                )}
                <div className="mt-3">
                  <Input type="file" accept="image/*" onChange={handleImage} />
                  <small className="text-muted">{preview ? 'Choose a file to replace the current image.' : 'Optional cover image.'}</small>
                </div>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light" onClick={() => setModalOpen(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !form.title.trim() || !stripHtml(form.content)}
          >
            {submitting ? 'Saving..' : editId ? 'Update' : 'Save'}
          </button>
        </ModalFooter>
      </Modal>

      {/* View modal */}
      <Modal isOpen={!!viewItem} toggle={() => setViewItem(null)} centered size="lg">
        <ModalHeader toggle={() => setViewItem(null)}>News Detail</ModalHeader>
        <ModalBody>
          {viewItem && (
            <article>
              {viewItem.image?.url && (
                <img
                  src={viewItem.image.url}
                  alt={viewItem.title}
                  style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 10, marginBottom: 20 }}
                />
              )}
              <h3 style={{ marginBottom: 8 }}>{viewItem.title}</h3>
              {viewItem.date && (
                <p className="text-muted d-flex align-items-center" style={{ gap: 6, marginBottom: 16 }}>
                  <FaRegCalendarAlt size={13} /> {formatDate(viewItem.date)}
                </p>
              )}
              <hr style={{ marginBottom: 18 }} />
              <div className="news-content" dangerouslySetInnerHTML={{ __html: viewItem.content || '' }} />
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

export default News;
