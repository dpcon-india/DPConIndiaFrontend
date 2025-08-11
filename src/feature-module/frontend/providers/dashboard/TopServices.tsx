import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '../../../../core/img/ImageWithBasePath';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ImageWithoutBasePath from '../../../../core/img/ImageWithoutBasePath';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { fetchTopServicesByProvider } from '../../../../APICalls';

const TopServices = () => {
  const routes = all_routes;
  const [services, setServices] = useState<any>();

  const serviceImage1 = (rowData: any) => {
    return (
      <Link to={routes.viewServices} className="table-imgname">
        {/* <ImageWithoutBasePath
          src={rowData?.image}
          className="me-2"
          alt="img"
          height={100}
          width={100}
        /> */}
        <span>{rowData?.serviceTitle}</span>
      </Link>
    );
   
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const res = await fetchTopServicesByProvider(id);
      const additional = res.map((e: any, i: number) => ({ ...e, id: i + 1 }));
      setServices(additional);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div className="card flex-fill">
      <div className="card-body">
        <div className="home-user">
          <div className="home-head-user home-graph-header">
            <h2>Top Services</h2>
            {/* <Link to={routes.providerService} className="btn btn-viewall">
              View All
              <ImageWithBasePath
                src="assets/admin/img/icons/arrow-right.svg"
                className="ms-2"
                alt="img"
              />
            </Link> */}
          </div>
          <div className="table-responsive datatable-nofooter">
            <table className="table datatable">
              <DataTable
                paginatorTemplate="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink  "
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                value={services}
              >
                <Column sortable field="id" header="#"></Column>
                <Column
                  sortable
                  field="service"
                  header="Service"
                  body={serviceImage1}                  
                ></Column>
                <Column
                  sortable
                  field="bookingCount"
                  header="Bookings"
                ></Column>
                <Column sortable field="category" header="Category"></Column>
                <Column sortable field="price" header="Amount"></Column>
              </DataTable>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopServices;
