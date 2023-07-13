import { MenuItem, Select } from '@mui/material';

import booksData from '../data/books'

const DynamicSelect = () => {
  return (
    <div>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={'1'}
        label="Age"
        onChange={() => { }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </div>
  )
}

export const SelectColumn = () => {
  return (
    <div>
      Select
      <DynamicSelect />
    </div>
  )
}