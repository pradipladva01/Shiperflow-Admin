import React from "react";
import Chart from "react-apexcharts";

const DashboardCard = ({
  title,
  value,
  percentage,
  seriesData,
  icon,
  color,
}) => {
  const chartOptions = {
    chart: {
      type: "bar",
      height: 40,
      sparkline: {
        enabled: true,
      },
    },
    colors: [color],
    plotOptions: {
      bar: {
        columnWidth: "70%",
        borderRadius: 2,
        borderRadiusApplication: "end",
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <>
      <div className="card_body">
        <div className="card_top">
          <div className="icons" style={{ backgroundColor: `${color}20` }}>
            {icon}
          </div>
          <h6>{title}</h6>
        </div>
        <div className="card_bottom">
          {seriesData && (
            <Chart
              options={chartOptions}
              series={[{ data: seriesData }]}
              type="bar"
              height={40}
              width={100}
            />
          )}
          <div className="b_cont">
            <h3>{value}</h3>
            <p style={{ color: color }}>{percentage}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCard;
