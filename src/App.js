import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './components/Chart/Chart.css'
import './components/CoinList/CoinList.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [period, setPeriod] = useState(24);
  const [exchangeData, setExchangeData] = useState([]);

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/all/coinlist`
      );
      setCoins(Object.values(response.data.Data));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchExchangeData = async () => {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/exchange/histohour?fsym=${selectedCoin}&tsym=USD&limit=${period}&api_key=dcfcd0786b11279802bd6257b455baa47de5aad62a8f8560ada53b9e2e1d0619`

      );
      setExchangeData(response.data.Data);
    };

    if (selectedCoin) {
      fetchExchangeData();
    }
  }, [selectedCoin, period]);

  useEffect(() => {
    if (exchangeData.length > 0) {
      drawChart();
    }
  }, [exchangeData]);

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

  const handleSelectCoin = (symbol) => {
    setSelectedCoin(symbol);
  };

  const handleSelectPeriod = (period) => {
    setPeriod(period);
  };

  const handleRefreshData = async () => {
    if (selectedCoin) {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/exchange/histohour?fsym=${selectedCoin}&tsym=USD&limit=${period}&api_key=dcfcd0786b11279802bd6257b455baa47de5aad62a8f8560ada53b9e2e1d0619`
      );
      setExchangeData(response.data.Data);
    }
  };

  return (
    <div className="coin-list">
      <header>
        <h1 className='h1'>Hourly Exchange Volume</h1>
        <div className="selects">
          <div className="select">
              <button
                className={`btn btn-primary${period === 24 ? 'active' : ''}`}
                onClick={() => handleSelectPeriod(24)}
              >
                1 Day
                </button>

            <button
              className={`btn btn-primary${period === 72 ? 'active' : ''}`}
              onClick={() => handleSelectPeriod(72)}
            >
              3 Days
            </button>
            <button
              className={`btn btn-primary${period === 168 ? 'active' : ''}`}
              onClick={() => handleSelectPeriod(168)}
            >
              Week
            </button>
            <button
              className={`btn btn-primary${period === 720 ? 'active' : ''}`}
              onClick={() => handleSelectPeriod(720)}
            >
              Month
            </button>
            <button className='btn btn-primary' onClick={handleRefreshData}>Refresh</button>

            <select className='btn btn-primary selectcoin' value={selectedCoin} onChange={(e) => handleSelectCoin(e.target.value)}>
              <option value=''>Select Coin</option>
              {coins.map((coin) => (
                <option key={coin.Symbol} value={coin.Symbol}>
                  {coin.CoinName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <div className="chart" ref={chartRef}></div>
    </div>
  );
};

export default App;
