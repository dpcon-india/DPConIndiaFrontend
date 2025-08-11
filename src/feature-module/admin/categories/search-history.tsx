import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
// import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import moment from 'moment';
// import * as Icon from 'react-feather';
import { fetchNotAvailable } from '../../../APICalls';

const SearchHistory = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('A - Z');
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const value = [{ name: 'A - Z' }, { name: 'Z - A' }];
  type SubCategory = {
    _id: string;
    id?: number;
    count: number;
    pincode: string;
    createdAt: Date;
    categoryId: string | any;
    date?: string;
  };

  const fetchCategories = async () => {
    try {
      const data = await fetchNotAvailable();
      if (data) {
        const formattedData = data.map((e: SubCategory, index: number) => ({
          ...e,
          id: index + 1,
          date: moment(e.createdAt).format('DD MMM YYYY'),
          categoryName: e?.categoryId?.categoryName || '',
        }));
        const sortedData = sortData(formattedData, sortOrder);
        setTotalRecords(sortedData.length);
        setData(sortedData.slice(first, first + rows));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [sortOrder, first, rows]);

  const sortData = (categories: any, order: string) => {
    return categories.sort((a: SubCategory, b: SubCategory) => {
      if (order === 'A - Z') {
        return a.pincode.localeCompare(b.pincode);
      } else {
        return b.pincode.localeCompare(a.pincode);
      }
    });
  };

  const handlePageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const handleSortChange = (e: any) => {
    setSelectedValue(e.value);
    setSortOrder(e.value.name);
  };

  return (
    <div className="page-wrapper page-settings">
      <div className="content">
        <div className="content-page-header content-page-headersplit mb-0">
          <h5>Service Not Availables</h5>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <DataTable
                value={data}
                showGridlines
                tableStyle={{ minWidth: '50rem' }}
              >
                <Column sortable field="id" header="ID" />
                <Column
                  sortable
                  field="pincode"
                  header="Not Availables Pincode"
                />
                <Column sortable field="count" header="Count" />
                {/* <Column sortable field="date" header="Date" /> */}
              </DataTable>
              <Paginator
                rows={rows}
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
                rowsPerPageOptions={[10, 25, 50]}
                className="mt-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
