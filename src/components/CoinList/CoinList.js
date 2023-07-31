import React from 'react';
import './CoinList.css'


const CoinList = ({ coins, onSelectCoin }) => {
  return (
    <select className="coin-list" onChange={(e) => onSelectCoin(e.target.value)}>
      <option className='selectcoin' value="">Select coin</option>
      {coins.map((coin) => (
        <option key={coin.Symbol} value={coin.Symbol}>
          {coin.CoinName}
        </option>
      ))}
    </select>
  );
};

export default CoinList;
