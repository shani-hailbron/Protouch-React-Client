import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});




function ShowItems() {
  const [items, setItems] = useState([]);
  const [copyItems, setCopyItems] = useState([]);
  const [ok, setOk] = useState(true);
  const classes = useStyles();


  useEffect(() => {
    axios.get(`https://localhost:44377/api/values/GetAllItems`)
      .then((data) => {
        console.log(data.data);
        setItems(data.data);
        setCopyItems(data.data);
      })
  }, {});


  let discountPercentage = 0;

  const changePrice = (e) => {
    discountPercentage = e;
  }

  const saveChanged = (item) => {
    axios.put(`https://localhost:44377/api/values/UpdatePrice/${item.id}/${discountPercentage}`)
      .then((data) => {
        setItems(data.data);
      })
  }

  const searchByBarcode = (event) => {
    if (event === '') {
      setItems(copyItems);
    }
    else {
      axios.get(`https://localhost:44377/api/values/SearchByBracode/${event}`)
        .then((data) => {
          setItems(data.data);
        })
    }
  }

  const searchBySupplier = (event) => {
    if (event === '') {
      setItems(copyItems);
    }
    else {
      axios.get(`https://localhost:44377/api/values/SearchBySupplier/${event}`)
        .then((data) => {
          setItems(data.data);
        })
    }
  }

  const searchByName = (event) => {
    if (event === '') {
      setItems(copyItems);
    }
    else {
      axios.get(`https://localhost:44377/api/values/SearchByName/${event}`)
        .then((data) => {
          setItems(data.data);
        })
    }
  }

  return (
    <div>
      <div className="search">
        <TextField id="outlined-basic type" label="חיפוש לפי ברקוד" variant="outlined" onChange={event => searchByBarcode(event.target.value)} color="secondary" />
        <TextField id="outlined-basic type" label="חיפוש לפי שם מוצר" variant="outlined" onChange={event => searchByName(event.target.value)} color="secondary" />
        <TextField id="outlined-basic type" label="חיפוש לפי שם ספק" variant="outlined" onChange={event => searchBySupplier(event.target.value)} color="secondary" />
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead >
            <TableRow >
              <StyledTableCell align="center">תמונה</StyledTableCell>
              <StyledTableCell align="center">ברקוד</StyledTableCell>
              <StyledTableCell align="center">שם פריט</StyledTableCell>
              <StyledTableCell align="center">מחיר</StyledTableCell>
              <StyledTableCell align="center">מחיר חדש</StyledTableCell>
              <StyledTableCell align="center">ספק</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <StyledTableRow key={item.name}>
                <StyledTableCell align="center"><img src={item.image} width="20" /></StyledTableCell>
                <StyledTableCell align="center">{item.id}</StyledTableCell>
                <StyledTableCell align="center">{item.name}</StyledTableCell>
                <StyledTableCell align="center" onClick={() => { setOk(false) }}>
                  {
                    ok ? '' :
                      <div className="changePrice">
                        <input placeholder="הכנס אחוז הנחה לשינוי" onChange={event => changePrice(event.target.value)} />
                        <button className="updateButton" type="submit" onClick={() => { saveChanged(item) }}>עדכן</button>
                      </div>
                  }
                  {item.price}
                </StyledTableCell>
                <StyledTableCell align="center">{item.newPrice} <br />
                  {item.discount !== '' ? item.discount === 'down' ?
                    <span className="discount">{item.discount}({100 - parseInt(item.newPrice / parseFloat(item.price) * 100)}) </span> :
                    <span className="discount">{item.discount}({parseInt(item.newPrice / parseFloat(item.price) * 100) - 100}) </span> : ''}
                </StyledTableCell>
                <StyledTableCell align="center">{item.supplier} </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShowItems;


