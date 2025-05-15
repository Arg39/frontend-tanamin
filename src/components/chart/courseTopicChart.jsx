import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CourseTopicChart = () => {
  const chartData = {
    labels: ['Baru', 'Design', 'Publish'],
    datasets: [
      {
        label: 'Course Status',
        data: [50, 30, 20],
        backgroundColor: ['#36d670', '#5d9ce0', '#8cd3e9'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const totalCourses = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-48 h-48">
        <Doughnut data={chartData} options={options} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="text-xl font-bold text-center text-primary-400">{totalCourses}</p>
          <p className="text-sm text-gray-500 text-center">Total Course</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
        {chartData.labels.map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
            ></span>
            <span>
              {label} ({chartData.datasets[0].data[index]}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTopicChart;
