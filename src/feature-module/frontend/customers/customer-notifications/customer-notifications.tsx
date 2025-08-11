import React, { useEffect, useState } from 'react';
import CustomerSideBar from '../common/sidebar';
import BreadCrumb from '../../common/breadcrumb/breadCrumb';
import {
  fetchNotifications,
  updateAnnoucementReadByStaff,
} from '../../../../APICalls';
import { FaBell, FaInfoCircle } from 'react-icons/fa'; // Using FontAwesome icons

const CustomerNotifications = () => {
  const [notificaions, setNotfications] = useState<any>();

  const fetchData = async () => {
    try {
      const notif = await fetchNotifications();
      setNotfications(notif);
      setTimeout(async () => {
        await updateAnnoucementReadByStaff();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <BreadCrumb title="Settings" item1="Customer" item2="Settings" />
      <div className="page-wrapper">
        <div className="content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4 ">
                <CustomerSideBar />
              </div>

              <div className="col-xl-9 col-lg-8">
                <h4 className="mb-4">Announcement</h4>
                <div>
                  {notificaions?.map((e: any) => (
                    <div className="notification-card card mb-4" key={e.id}>
                      <div className="card-body d-flex align-items-start">
                        <div
                          className="icon-container mr-2"
                          style={{ marginRight: '1em' }}
                        >
                          <FaBell
                            size={15}
                            color={e?.isRead ? 'lightblue' : 'blue'}
                          />
                        </div>
                        <div className="notification-content ml-3">
                          <h5 className="card-title">{e?.subject}</h5>
                          <p className="card-text">{e?.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerNotifications;
