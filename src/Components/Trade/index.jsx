import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';
import {CardHeader,CardFooter} from 'reactstrap';
import { Col, Card, CardBody, Form } from 'reactstrap';
import { H5 } from '../../AbstractElements';
import TextEditor from '../../CommonElements/TextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrade, updateTrade } from '../../Redux/Slices/tradeSlice.js';
const Index = () => {
  const dispatch=useDispatch();
  const {loading,submitting,tradeText} = useSelector(state=>state.trade);
  const [content, setContent]=useState("");
  
  useEffect(() => {
    dispatch(fetchTrade());
  }, []);
  
  useEffect(() => {
   setContent(tradeText.text);
  }, [tradeText.text]);

  const handleProcedureContentChange = () => {
    dispatch(updateTrade({id:tradeText._id,text:content}));
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='How to Trade' parent='How to Trade' />
      <Container fluid={true}>
        <Row>
          <Col sm='12'>
          <Card>
            <CardHeader><H5>How to Trade</H5></CardHeader>
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
