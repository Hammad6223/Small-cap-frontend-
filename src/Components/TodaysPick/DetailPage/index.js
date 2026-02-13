import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import HeaderCard from '../../Common/Component/HeaderCard';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocksDetail } from '../../../Redux/Slices/todayspick';
import  Chart  from '../../../CommonElements/Chart'
import formateDataPoints from '../../../utils/formateDataPoints';
const StockDetail = () => {
  const {symbol}=useParams()
  const {loading,stockDetail}=useSelector(state=>state.todaysPick)
  const dispatch=useDispatch();
  const [dataPoints,setDataPoints]=useState({close: [],high:[],low: [],open: [],volumne:[]});

  
  useEffect(() => {
    dispatch(fetchStocksDetail(symbol))
  }, []);


  useEffect(() => {
    if(stockDetail.values){
      setDataPoints(formateDataPoints(stockDetail.values))
    }
  }, [stockDetail]);

  
  return (
    <Fragment>
    <Breadcrumbs mainTitle="Stocks Detail" parent="stocks detail"  />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <HeaderCard title={`Meta: ${symbol}`} />
              <CardBody>
                {
                  !loading && Object.keys(stockDetail).length ?   (
                    <>
                    <Row className='row'>
                      <Col sm="6" md="4">
                          <p><b><span>Currency:</span></b> {stockDetail.meta.currency}</p>
                      </Col>
                      <Col sm="6" md="4">
                          <p><b><span>Mic Code:</span></b> {stockDetail.meta.mic_code}</p>
                      </Col>
                      <Col sm="6" md="4">
                          <p><b><span>Exchange:</span></b> {stockDetail.meta.exchange}</p>
                      </Col>
                      <Col sm="6" md="4">
                          <p><b><span>Exchange Time Zone:</span></b> {stockDetail.meta.exchange_timezone}</p>
                      </Col>
                    </Row>
                    </>
                  ):(
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )
                }
              </CardBody>
            </Card>
          </Col>
          <Col sm="12">
            <Card>
              <HeaderCard title={`Value: ${symbol}`} />
              <CardBody>
              {
                  !loading && Object.keys(stockDetail).length ?   (
                    <>
                    <Chart currency={stockDetail.meta.currency} dataPoints={dataPoints}/>
                    </>
                  ):(
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default StockDetail;