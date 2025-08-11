import React, { useEffect, useState } from 'react';
import ImageWithBasePath from '../../../core/img/ImageWithBasePath';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../core/data/routes/all_routes';
import { fetchUserProviderService } from '../../../APICalls';

const Profiles = () => {
  const routes = all_routes;
  const [data, setData] = useState<{
    user: number;
    provider: number;
    service: number;
  }>({ user: 0, provider: 0, service: 0 });
  const fetchData = async () => {
    try {
      const res = await fetchUserProviderService();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="row">
      <div className="col-lg-4 col-sm-6 col-12 d-flex widget-path widget-service">
        <div className="card">
          <div className="card-body">
            <div className="home-user">
              <div className="home-userhead">
                <div className="home-usercount">
                  <span>
                    <ImageWithBasePath
                      src="assets/admin/img/icons/user.svg"
                      alt="img"
                    />
                  </span>
                  <h6>User</h6>
                </div>
                <div className="home-usercontent">
                  <div className="home-usercontents">
                    <div className="home-usercontentcount">
                      <span className="counters" data-count={30}>
                        {data?.user}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 col-12 d-flex widget-path widget-service">
        <div className="card">
          <div className="card-body">
            <div className="home-user home-provider">
              <div className="home-userhead">
                <div className="home-usercount">
                  <span>
                    <ImageWithBasePath
                      src="assets/admin/img/icons/user-circle.svg"
                      alt="img"
                    />
                  </span>
                  <h6>Providers</h6>
                </div>{' '}
                <div className="home-usercontent">
                  <div className="home-usercontents">
                    <div className="home-usercontentcount">
                      <span className="counters" data-count={25}>
                        {data?.provider}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-sm-6 col-12 d-flex widget-path widget-service">
        <div className="card">
          <div className="card-body">
            <div className="home-user home-service">
              <div className="home-userhead">
                <div className="home-usercount">
                  <span>
                    <ImageWithBasePath
                      src="assets/admin/img/icons/service.svg"
                      alt="img"
                    />
                  </span>
                  <h6>Service</h6>
                </div>
                <div className="home-usercontent">
                  <div className="home-usercontents">
                    <div className="home-usercontentcount">
                      <span className="counters" data-count={18}>
                        {data?.service}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
