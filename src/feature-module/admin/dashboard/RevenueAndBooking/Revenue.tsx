import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { fetchRevenue } from '../../../../APICalls';

const Revenue = () => {
  const [timeframe, setTimeframe] = useState('Monthly'); // State to track the current timeframe
  const [chartData, setChartData] = useState<any>({
    series: [],
    categories: [],
  });

  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await fetchRevenue(timeframe);
        setChartData({
          series: [
            {
              name: 'Revenue',
              data: data?.map((item: any) => item.revenue),
            },
          ],
          categories: data?.map((item: any) => item.timeframe),
        });
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [timeframe]);

  const getMonthAndWeek = (num: any) => {
    const arr = [];
    if (num?.length <= 0) return [];
    for (const n of num) {
      let result;
      switch (timeframe) {
        case 'Monthly': {
          result = month[n - 1] || '';
          break;
        }
        case 'Weekly': {
          const remainder = n % 7;
          result = week[remainder] || '';
          break;
        }
        default: {
          result = '';
          break;
        }
      }
      arr.push(result);
    }
    return arr;
  };
  const chartOptions: any = {
    chart: {
      height: 350,
      type: 'area',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.1,
        opacityFrom: 0.5,
        opacityTo: 0.5,
        stops: [0, 50, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      curve: 'smooth',
    },
    xaxis: {
      categories: getMonthAndWeek(chartData?.categories || []),
    },
    tooltip: {
      theme: 'dark',
    },
  };
  return (
    <div className="col-lg-6 col-sm-6 col-12 d-flex  widget-path">
      <div className="card">
        <div className="card-body">
          <div className="home-user">
            <div className="home-head-user">
              <h2>Revenue</h2>
              <div className="home-select">
                <div className="dropdown">
                  <button
                    className="btn btn-action btn-sm dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {timeframe}
                  </button>
                  <ul
                    className="dropdown-menu"
                    data-popper-placement="bottom-end"
                  >
                    {['Weekly', 'Monthly', 'Yearly'].map((option) => (
                      <li key={option}>
                        <button
                          className="dropdown-item"
                          onClick={() => setTimeframe(option)}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
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
              {chartData?.categories && (
                <ReactApexChart
                  options={chartOptions}
                  series={chartData.series}
                  // series={dataByTimeframe[timeframe].series}
                  type="area"
                  height={350}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
