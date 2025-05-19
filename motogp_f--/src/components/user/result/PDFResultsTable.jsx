import React, {useState} from 'react';
import {ExportOutlined, FilePdfOutlined} from '@ant-design/icons';

const PDFResultsTable = () => {
  const [activeTab, setActiveTab] = useState('session');

  const sessionItems = [
    'analysis',
    'analysis by lap',
    'average speed',
    'classification',
    'fast lap rider',
    'fast lap sequence',
    'grid',
    'lap chart',
    'session',
    'world standing'
  ];

  const championshipItems = [
    'entry',
    'entry biographical',
    'event maximum speed',
    'independent team rider',
    'riders all time',
    'riders performance',
    'rookie of the year',
    'season statistics',
    'world standing'
  ];

  const eventItems = [
    'circuit information',
    'nations statistics',
    'podiums',
    'pole positions',
    'riders all time'
  ];

  const getItemsForTab = (tab) => {
    switch (tab) {
      case 'session':
        return sessionItems;
      case 'championship':
        return championshipItems;
      case 'event':
        return eventItems;
      default:
        return [];
    }
  };

  const currentItems = getItemsForTab(activeTab);
  const half = Math.ceil(currentItems.length / 2);
  const firstColumnItems = currentItems.slice(0, half);
  const secondColumnItems = currentItems.slice(half);

  const renderItem = (item, index) => (
    <div key={index}
         className="flex items-center space-x-2 px-2 py-3 cursor-pointer justify-between hover:text-red-600">
      <div className={'flex items-center space-x-2'}>
        <FilePdfOutlined/>
        <span className="uppercase text-xs font-semibold">{item}</span>
      </div>
      <ExportOutlined/>
    </div>
  );

  return (
    <section className="mx-14 mb-7">
      <div className={'flex space-x-2 mb-4'}>
        <button
          className={`border px-6 py-1 rounded-2xl ${activeTab === 'session' ? '!bg-red-700 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('session')}
        >
          Session Results
        </button>
        <button
          className={`border px-6 py-1 rounded-2xl ${activeTab === 'championship' ? '!bg-red-700 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('championship')}
        >
          Championship Results
        </button>
        <button
          className={`border px-6 py-1 rounded-2xl ${activeTab === 'event' ? '!bg-red-700 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('event')}
        >
          Event Results
        </button>
      </div>

      {currentItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className={"bg-white divide-y"}>
            {firstColumnItems.map(renderItem)}
          </div>
          <div className={"bg-white divide-y"}>
            {secondColumnItems.map(renderItem)}
          </div>
        </div>
      )}
    </section>
  );
};

export default PDFResultsTable;