import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';
import {CardHeader,CardFooter} from 'reactstrap';
import { Col, Card, CardBody, Form } from 'reactstrap';
import { H5 } from '../../AbstractElements.jsx';
import TextEditor from '../../CommonElements/TextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPolicy, updatePolicy } from '../../Redux/Slices/policySlice.js';
const Index = () => {
  const dispatch=useDispatch();
  const {loading,submitting,policyText} = useSelector(state=>state.policy);
  const [content, setContent]=useState("");
  
  useEffect(() => {
    dispatch(fetchPolicy());
  }, []);
  
  useEffect(() => {
   setContent(policyText.text);
  }, [policyText.text]);

  const handleProcedureContentChange = () => {
    dispatch(updatePolicy({id:policyText._id,text:content}));
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Privacy Policy' parent='Privacy Policy' />
      <Container fluid={true}>
        <Row>
          <Col sm='12'>
          <Card>
            <CardHeader><H5>Privacy Policy</H5></CardHeader>
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
