import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { all_routes } from '../../../../core/data/routes/all_routes';
import { api, formDataHeader } from '../../../../config';

const Graph = () => {
  const routes = all_routes;
  const [sCol, setSCol] = useState<any>({
    series: [
      {
        name: 'Bookings',
        data: [], // Data will be populated dynamically
      },
    ],
    chart: {
      type: 'bar',
      height: 140,
    },
    colors: ['#4A00E5'],
    plotOptions: {
      bar: {
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [], // Categories (e.g., days, months) will be populated dynamically
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  });
  const [timePeriod, setTimePeriod] = useState('weekly');

  const [totalIncome, setTotalIncome] = useState(0); // Example placeholder
  const [totalDue, setTotalDue] = useState(0); // Example placeholder
  const [performance, setPerformance] = useState(''); // Performance text
  useEffect(() => {
    const fetchBookingsSummary = async () => {
      try {
        const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
        const providerId = id;
        const response = await axios.get(
          `${api}bookings-summary/provider/${providerId}?period=${timePeriod}`,
          formDataHeader,
        );

        const bookings = response.data.bookings || [];
        let categories = bookings.map((item: any) => item.date || 'N/A');

        // Format the categories based on timePeriod
        if (timePeriod === 'weekly') {
          categories = categories.map(
            (date: string) =>
              new Date(date).toLocaleString('en-US', { weekday: 'short' }), // e.g., "Mon"
          );
        } else if (timePeriod === 'monthly') {
          categories = categories.map(
            (date: string) =>
              new Date(date).toLocaleString('en-US', { month: 'short' }), // e.g., "Jan"
          );
        }

        const data = bookings.map((item: any) => item.count || 0);

        setSCol((prev: any) => ({
          ...prev,
          series: [{ ...prev.series[0], data }],
          xaxis: { ...prev.xaxis, categories },
        }));

        setTotalIncome(8145); // Replace with actual logic
        setTotalDue(1200); // Replace with actual logic
        setPerformance('30% better last month'); // Replace with actual logic
      } catch (error) {
        console.error('Error fetching bookings summary:', error);
      }
    };

    fetchBookingsSummary();
  }, [timePeriod]);

  return (
    <div className="col-xxl-3 col-md-6">
      <div className="card flex-fill">
        <div className="card-body">
          <div>
            {/* <div className="d-flex justify-content-center flex-column mb-3">
              <h5 className="text-center">
                1,500{' '}
                <span className="text-success">
                  <i className="ti ti-arrow-badge-up-filled" />
                </span>
              </h5>
              <p className="fs-12 text-center">Total earned last week so far</p>
            </div> */}
            {/* <div className="d-flex justify-content-around mb-3">
              <div>
                <p className="mb-0">Total Income</p>
                <h5>${totalIncome}</h5>
              </div>
              <div>
                <p className="mb-0">Total Due</p>
                <h5>${totalDue}</h5>
              </div>
            </div> */}
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
                      onClick={() => setTimePeriod('weekly')}
                    >
                      Weekly
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimePeriod('monthly')}
                    >
                      Monthly
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setTimePeriod('yearly')}
                    >
                      Yearly
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div id="daily-chart">
              <ReactApexChart
                options={sCol}
                series={sCol.series}
                type="bar"
                height={200}
              />
            </div>
            <div className="d-flex justify-content-center flex-column">
              {/* <span className="text-success text-center fs-12 mb-4">
                {performance}
              </span> */}
              <Link to={routes.providerEarnings} className="btn btn-dark">
                View All Earnings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;

//   const [sCol2] = useState<any>({
//     series: [
//       {
//         name: 'sales',
//         colors: ['#FFC38F'],
//         data: [
//           {
//             x: 'Inpipeline',
//             y: 400,
//           },
//           {
//             x: 'Follow Up',
//             y: 130,
//           },
//           {
//             x: 'Schedule',
//             y: 248,
//           },
//           {
//             x: 'Conversation',
//             y: 470,
//           },
//           {
//             x: 'Won',
//             y: 470,
//           },
//           {
//             x: 'Lost',
//             y: 180,
//           },
//         ],
//       },
//     ],
//     chart: {
//       type: 'bar',
//       height: 260,
//     },
//     plotOptions: {
//       bar: {
//         borderRadiusApplication: 'around',
//         columnWidth: '40%',
//       },
//     },
//     colors: ['#00918E'],
//     xaxis: {
//       type: 'category',
//       group: {
//         style: {
//           fontSize: '7px',
//           fontWeight: 700,
//         },
//       },
//     },
//   });
