import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchBookingSummary } from '../../../../APICalls';

const Bookings = () => {
  const [timePeriod, setTimePeriod] = useState('Monthly');
  const [chartData, setChartData] = useState<any>({
    data: [],
    categories: [],
  });
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await fetchBookingSummary(timePeriod);

        setChartData({
          data: [
            {
              name: 'Booking',
              data: data?.data,
            },
          ],
          categories: data?.categories,
        });
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [timePeriod]);
  // const { categories, data } = getChartData(timePeriod);

  const chartOption: any = {
    colors: ['#4169E1'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData?.categories || [],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    series: [
      {
        name: 'Received',
        type: 'column',
        data: chartData?.data || [],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
  };

  return (
    <div className="col-lg-6 col-sm-6 col-12 d-flex  widget-path">
      <div className="card">
        <div className="card-body">
          <div className="home-user">
            <div className="home-head-user">
              <h2>Booking Summary</h2>
              <div className="home-select">
                <div className="dropdown">
                  <button
                    className="btn btn-action btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {timePeriod}
                  </button>
                  <ul
                    className="dropdown-menu"
                    data-popper-placement="bottom-end"
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setTimePeriod('Weekly')}
                      >
                        Weekly
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setTimePeriod('Monthly')}
                      >
                        Monthly
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setTimePeriod('Yearly')}
                      >
                        Yearly
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <Link
                    className="delete-table bg-white"
                    to="#"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  >
                    <i className="fa fa-ellipsis-v" aria-hidden="true" />
                  </Link>
                  <ul
                    className="dropdown-menu"
                    data-popper-placement="bottom-end"
                  >
                    <li>
                      <Link to="#" className="dropdown-item">
                        View
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item">
                        Edit
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="chartgraph">
              <ReactApexChart
                options={chartOption}
                series={chartData.data}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
