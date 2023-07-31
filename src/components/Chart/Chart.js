import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Chart.css';


const Chart = ({ exchangeData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const drawChart = () => {
        const data = exchangeData.map((entry) => ({
          time: new Date(entry.time * 1000),
          volume: entry.volume,
        }));

      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const width = 900 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      d3.select(chartRef.current).selectAll('*').remove();

      const svg = d3
        .select(chartRef.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.time))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.volume)])
        .nice()
        .range([height, 0]);

      const line = d3
        .line()
        .x((d) => x(d.time))
        .y((d) => y(d.volume));

      svg
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      svg.append('g').call(d3.axisLeft(y));
    };

    if (exchangeData.length) {
      drawChart();
    }
  }, [exchangeData]);

  return <div className="chart" ref={chartRef}></div>;
};

export default Chart;
