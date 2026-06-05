import React, { Fragment, useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs } from '../../AbstractElements';
import HeaderCard from '../Common/Component/HeaderCard';
import TextEditor from '../../CommonElements/TextEditor';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchNews, addNews, updateNews, deleteNews } from '../../Redux/Slices/newsSlice';

const emptyForm = { title: '', content: '', date: '', image: null };

// Quill leaves "<p><br></p>" when empty, so check the actual text.
const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

const News = () => {
  const dispatch = useDispatch();
  const { news, loading, submitting } = useSelector((state) => state.news);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    dispatch(fetchNews());
  }, []);

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
    const action = editId
      ? updateNews({ id: editId, data: form })
      : addNews(form);
    dispatch(action)
      .unwrap()
      .then(() => setModalOpen(false))
      .catch(() => {});
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this news article?')) return;
    dispatch(deleteNews(row._id));
  };

  const tableColumns = [
    {
      name: 'Image',
      cell: (row) =>
        row.image?.url ? (
          <img src={row.image.url} alt={row.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        ) : (
          <span className="text-muted">—</span>
        ),
      width: '90px',
    },
    { name: 'Title', selector: (row) => row.title, sortable: true, wrap: true, grow: 2 },
    { name: 'Date', selector: (row) => (row.date ? new Date(row.date).toLocaleDateString() : '—'), center: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: 14 }}>
          <FaEye title="View" style={{ fontSize: 18, color: '#2a9d8f', cursor: 'pointer' }} onClick={() => openView(row)} />
          <FaEdit title="Edit" style={{ fontSize: 18, color: '#3b82f6', cursor: 'pointer' }} onClick={() => openEdit(row)} />
          <FaTrash title="Delete" style={{ fontSize: 16, color: '#ef4444', cursor: 'pointer' }} onClick={() => handleDelete(row)} />
        </div>
      ),
      center: true,
      grow: 2,
    },
  ];

  return (
    <Fragment>
      <Breadcrumbs mainTitle="News" parent="News" title="Manage News" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title="News Articles" />
              <CardBody>
                <div className="text-end mb-3">
                  <button className="btn btn-primary" onClick={openAdd}>Add News</button>
                </div>
                <DataTable
                  data={news}
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

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} centered size="lg">
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          {editId ? 'Edit News' : 'Add News'}
        </ModalHeader>
        <ModalBody>
          <Form className="form theme-form">
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
            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <TextEditor
                value={form.content}
                onChange={(val) => setForm({ ...form, content: val })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
              <Input type="file" accept="image/*" onChange={handleImage} />
              {preview && (
                <img src={preview} alt="preview" style={{ marginTop: 10, width: 120, height: 80, objectFit: 'cover', borderRadius: 4 }} />
              )}
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

      <Modal isOpen={!!viewItem} toggle={() => setViewItem(null)} centered size="lg">
        <ModalHeader toggle={() => setViewItem(null)}>News Detail</ModalHeader>
        <ModalBody>
          {viewItem && (
            <article>
              {viewItem.image?.url && (
                <img
                  src={viewItem.image.url}
                  alt={viewItem.title}
                  style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 8, marginBottom: 20 }}
                />
              )}
              <h3 style={{ marginBottom: 8 }}>{viewItem.title}</h3>
              <p className="text-muted" style={{ marginBottom: 20 }}>
                {viewItem.date ? new Date(viewItem.date).toLocaleDateString() : ''}
              </p>
              <div
                className="news-content"
                style={{ lineHeight: 1.7, fontSize: 15 }}
                dangerouslySetInnerHTML={{ __html: viewItem.content || '' }}
              />
            </article>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light" onClick={() => setViewItem(null)}>Close</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              openEdit(viewItem);
              setViewItem(null);
            }}
          >
            Edit
          </button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default News;
