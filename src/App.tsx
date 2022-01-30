import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

import './App.css';
import Dashboard from './components/Dashboard';
import Header from 'components/Header';
import Legend from 'components/Legend';
import Loader from 'components/Loader';
import { Data } from './utils/common';

function App() {
  const [data, setData] = useState<Array<Data>>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus('pending');
    const prepareData = async () => {
      const csvData = await fetchCsv();
      if (csvData) {
        Papa.parse(csvData, {
          dynamicTyping: true,
          header: true,
          complete: onCompleteParsing,
          worker: true,
        });
      }
    };

    prepareData();
  }, []);

  const onCompleteParsing = (results: Papa.ParseResult<Data>) => {
    const { data, errors } = results;
    if (errors.length) {
      // not in scope of this task
      console.error('Parsing error', errors);
    }
    setData(data);
    setStatus('ready');
  };

  const fetchCsv = async () =>
    fetch(process.env.PUBLIC_URL + '/data/data.csv').then(response =>
      response.text()
    );

  return (
    <>
      <div className="App">
        <Header />
        <Legend />
        <Dashboard data={data} />
      </div>
      {status === 'pending' && <Loader />}
    </>
  );
}

export default App;
