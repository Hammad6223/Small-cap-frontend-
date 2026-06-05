import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { tableColumns } from './Defaultdata';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { Spinner } from 'reactstrap';
import { addTodaysStocks, fetchAllStocks, fetchTodaysStocks } from '../../Redux/Slices/todayspick';
import { FaList } from "react-icons/fa6";
import todaysPickUtils from '../../utils/todaysPickUtils';

const DataTableComponent = () => {
   
    const {allStocks,todaysStock,loading}=useSelector(state=>state.todaysPick);
    const [fav,setFav]=useState([]);
    const [isFavSelected,setIsFavSelected]=useState(0);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleCheckboxChange = (value) => {
        // Functional update so rapid toggles in the same render batch don't
        // drop a change (avoids stale-closure bugs on fav).
        setFav((prev) =>
          prev.includes(value)
            ? prev.filter((selectedValue) => selectedValue !== value)
            : [...prev, value]
        );
      };

    const handleSave = () => {
        if (loading) return;
        if (!window.confirm("This will replace the current Today's Pick with the selected stocks. Continue?")) return;
        dispatch(addTodaysStocks({ symbols: fav }));
      };


    const allstocktabledata = allStocks.map((item, index) => ({
        id: index,
        checkbox:<input type='checkbox' checked={fav.includes(item.symbol)} onChange={()=>handleCheckboxChange(item.symbol)} style={{cursor:'pointer'}}/>,
        Symbol: item.symbol,
        Name: item.name,
        Currency:item.currency,
        Exchange: item.exchange,
        Action: <FaList style={{fontSize:'20px',color:'green',cursor:'pointer'}} onClick={()=>navigate(`/todays_pick/detail/${item.symbol}`)}/>
    }));

    const todaystocktabledata = todaysStock.map((item, index) => ({
        id: index,
        checkbox:<input type='checkbox' checked={fav.includes(item.meta.symbol)} onChange={()=>handleCheckboxChange(item.meta.symbol)} style={{cursor:'pointer'}}/>,

        Symbol: item.meta.symbol,
        Name: item.meta.symbol,
        Currency:item.meta.currency,
        Exchange: item.meta.exchange,
        Action: <FaList style={{fontSize:'20px',color:'green',cursor:'pointer'}}/>
    }));


    useEffect(()=>{
        dispatch(fetchAllStocks());
        dispatch(fetchTodaysStocks());
    },[])

    // Seed selected favourites from the saved picks once they load.
    useEffect(()=>{setFav(todaysPickUtils(todaysStock))},[todaysStock])

    return (
        <Fragment>
            <button className={'btn mx-1'} style={{backgroundColor:'#fde3e3',color:'red'}} onClick={()=>setIsFavSelected(0)}>All</button>
            <button className={'btn mx-1'} style={{backgroundColor:'#fde3e3',color:'red'}} onClick={()=>setIsFavSelected(1)}>Favourites</button>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner animation="border" size="sm" />
                </div>
            ) : (

                <>

                <DataTable
                    data={isFavSelected?todaystocktabledata:allstocktabledata}
                    columns={tableColumns}
                    striped={true}
                    center={true}
                    pagination
                    />
                <center><button className='btn btn-primary mx-1' onClick={handleSave} disabled={loading}>{loading ? 'Saving..' : "Save to Today's Pick"}</button></center>
                </>
            )} 
        </Fragment>
    )
}
export default DataTableComponent