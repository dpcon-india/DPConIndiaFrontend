import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { fetchRevenue } from '../../../../APICalls';

const Revenue = () => {
  const [timeframe, setTimeframe] = useState('Monthly'); // Current timeframe
  const [chartData, setChartData] = useState<any>({
    series: [],
    categories: [],
  });

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
      categories: chartData.categories,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  return (
    <div className="revenue-container">
      <div className="dropdown">
        <button
          onClick={() => setTimeframe('Weekly')}
          className={timeframe === 'Weekly' ? 'active' : ''}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimeframe('Monthly')}
          className={timeframe === 'Monthly' ? 'active' : ''}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimeframe('Yearly')}
          className={timeframe === 'Yearly' ? 'active' : ''}
        >
          Yearly
        </button>
      </div>
      <ReactApexChart
        options={chartOptions}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default Revenue;
