import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import {CardHeader,CardFooter} from 'reactstrap';
import { Col, Card, CardBody, Form } from 'reactstrap';
import { H5 } from '../../../AbstractElements';
import TextEditor from '../../../CommonElements/TextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTerm, updateTerm } from '../../../Redux/Slices/termSlice.js';
const Index = () => {
  const dispatch=useDispatch();
  const {loading,submitting,termText} = useSelector(state=>state.term);
  const [content, setContent]=useState("");
  
  useEffect(() => {
    dispatch(fetchTerm());
  }, []);
  
  useEffect(() => {
   setContent(termText.text);
  }, [termText.text]);

  const handleProcedureContentChange = () => {
    dispatch(updateTerm({id:termText._id,text:content}));
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Terms & Conditions' parent='Terms & Conditions' />
      <Container fluid={true}>
        <Row>
          <Col sm='12'>
          <Card>
            <CardHeader><H5>Terms & Conditions</H5></CardHeader>
                {
                  loading && content?
                  ("loading....."):
                  (<Form className="form theme-form">
                      <CardBody>
                          <Row className='mb-3'>
                            <Col sm='12'>
                              <TextEditor value={content} onChange={(e)=>setContent(e)}/>
                            </Col>
                          </Row>
                      </CardBody>
                      <CardFooter className="text-end">
                        <button type='button' className='btn btn-primary mx-1' onClick={handleProcedureContentChange} disabled={submitting} >{submitting?'saving..': 'Save'}</button>
                        <button className='btn btn-primary mx-1' type='button'>Clear</button>
                      </CardFooter>
                  </Form>)
                
                }
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Index;
