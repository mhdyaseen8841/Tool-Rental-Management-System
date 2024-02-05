import { useState, useEffect, useRef } from 'react';
import {

  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Card,
  TableContainer,
  Chip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button

} from '@mui/material';
import requestPost from '../../../serviceWorker'
import { MoreVert, SignalCellularNullSharp } from '@material-ui/icons';
import { Stack, color } from '@mui/system';


const TableAction = ({ options = [] }) => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(SignalCellularNullSharp)
  return (
    <>
      <IconButton
        ref={ref}
        onClick={(e) => { setOpen(true); setAnchorEl(event.currentTarget); }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={ref.current}
        open={open}
        onClose={() => { setOpen(false) }}
        PaperProps={{
          style: {
            width: '15ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={option.clickHandle}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default function ItemTable(details) {


  const [data, setData] = useState([])
  const [editStatus, setEditStatus] = useState(false)
  const [selectedIndex, setSelectedindex] = useState(-1)
  const [qty, setQty] = useState()
  const [note, setNote] = useState()
  const [error, seterror] = useState("")

  function getData() {
    let datas = {
      "type": "SP_CALL",
      "requestId": 1300005,
      request: {
        "itemId": details.data
      }
    }


    requestPost(datas).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(

            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {

        if (res.result[0] == null) {
          setData([])
        } else {
          setData(res.result)
        }
      }
    })
  }

  useEffect(() => {

    getData()
  }, [])


  const handleEdit = (data, ind) => {
    setEditStatus(true)
    setSelectedindex(ind)
    setQty(data.qty)
    setNote(data.note)
    console.log(data);
  }

  const handleEditSave = (data) => {
    if (!qty) {
      seterror("please Enter qty")
      return
    }
    
    let datas = {
      "type": "SP_CALL",
      "requestId": 1300002,
      request: {
        "sId": data.sId,
        "note": note,
        "qty": qty
      }
    }


    requestPost(datas).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(
            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        getData()
        setEditStatus(false)
      }
    })
  }


  const handleDelete = (data) => {
    let datas = {
      "type": "SP_CALL",
      "requestId": 1300003,
      request: {
        "sId": data.sId
      }
    }


    requestPost(datas).then((res) => {

      if (res.errorCode === 3) {
        Router
          .push(
            {
              pathname: '/',
              query: { redirect: '1' },
            })
      } else {
        getData()
      }
    })
  }

  return (
    <div>
      <Card >

        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>

                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Quantity
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Note
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>


            <TableBody>

              {data.map((row, index) => {
                return (
                  <TableRow
                    key={index}

                  >
                    <TableCell >
                      <Typography noWrap>{row.date}</Typography>
                    </TableCell>
                    <TableCell>
                      {editStatus && selectedIndex === index ? <TextField defaultValue={row.qty} inputProps={{
                        sx: {
                          height: "10px",
                          width: '40px'
                        },
                      }}
                      onChange={(e)=>{setQty(e.target.value)}}
                      /> : row.qty}
                    </TableCell>
                    <TableCell>
                      {row.status == 1 ? <Typography sx={{ backgroundColor: 'success.main', borderRadius: '20px', textAlign: 'center', color: 'white', fontWeight: '500', width: '100px' }}>Purchased</Typography>
                        : <Typography sx={{ backgroundColor: 'error.main', borderRadius: '20px', textAlign: 'center', color: 'white', fontWeight: '500', width: '80px' }}>Loss</Typography>}
                    </TableCell>
                    <TableCell>
                      {editStatus && selectedIndex === index ? <TextField defaultValue={row.note}  onChange={(e)=>{setNote(e.target.value)}} /> : row.note}
                    </TableCell>
                    <TableCell>
                      {
                        editStatus && selectedIndex === index ?
                          (
                            <Stack>
                              <Typography color={'error.main'}>{error}</Typography>
                              <Stack direction={'row'} spacing={1}>
                                <Button variant='contained'
                                  sx={{ backgroundColor: 'error.main', color: '#fff', ":hover": { backgroundColor: 'error.dark' } }}
                                  onClick={() => { setEditStatus(false);seterror("") }}
                                >
                                  cancel
                                </Button>
                                <Button variant='contained'
                                  sx={{ backgroundColor: 'primary.main', color: '#fff' }}
                                  onClick={() => { handleEditSave(row) }}
                                >
                                  Save
                                </Button>
                              </Stack>
                            </Stack>
                          ) :
                          <TableAction options={
                            [{ label: 'Edit', clickHandle: () => { handleEdit(row, index) } },
                            { label: 'Delete', clickHandle: () => { handleDelete(row) } }]} />
                      }
                    </TableCell>

                  </TableRow>


                )



              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}
