import React, { useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import {Button} from "antd";

const PDFResultsTable = () => {
  const [activeTab, setActiveTab] = useState('event'); // 'session', 'championship', 'event'

  const sessionData = [
    { name: 'analysis', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/Analysis.pdf' },
    { name: 'analysis by lap', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/analysisbylap.pdf' },
    { name: 'average speed', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/AverageSpeed.pdf' },
    { name: 'classification', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/Classification.pdf' },
    { name: 'fast lap rider', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/FastLapRider.pdf' },
    { name: 'fast lap sequence', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/FastLapSequence.pdf' },
    { name: 'grid', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/Grid.pdf' },
    { name: 'lap chart', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/LapChart.pdf' },
    { name: 'session', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/Session.pdf' },
    { name: 'world standing', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/worldstanding.pdf' }
  ];

  const championshipData = [
    { name: 'entry', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/Entry.pdf' },
    { name: 'entry biographical', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/EntryBiographical.pdf' },
    { name: 'event maximum speed', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/EventMaximumSpeed.pdf' },
    { name: 'independent team rider', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/IndependentTeam.pdf' },
    { name: 'riders all time', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/table5.pdf' },
    { name: 'riders performance', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RidersPerformance.pdf' },
    { name: 'rookie of the year', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/rookieirtacup.pdf' },
    { name: 'season statistics', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/table1.pdf' },
    { name: 'world standing', url: 'https://resources.motogp.com/files/results/2025/FRA/MotoGP/RAC/worldstanding.pdf' }
  ];

  const eventData = [
    { name: 'circuit information', url: 'https://resources.motogp.com/files/results/2025/FRA/CircuitInformation.pdf' },
    { name: 'nations statistics', url: 'https://resources.motogp.com/files/results/2025/FRA/table2.pdf' },
    { name: 'podiums', url: 'https://resources.motogp.com/files/results/2025/FRA/Podiums.pdf' },
    { name: 'pole positions', url: 'https://resources.motogp.com/files/results/2025/FRA/PolePositions.pdf' },
    { name: 'riders all time', url: 'https://resources.motogp.com/files/results/2025/FRA/table4.pdf' }
  ];

  return (
    <section className="mx-14 mb-7">
      <div className={'flex space-x-2'}>
        <Button className={'border px-6 rounded-2xl !bg-red-600 text-white'} color='danger' variant='solid'>Session Results</Button>
        <Button className={'border px-6 rounded-2xl !bg-red-600 text-white'} color='danger' variant='solid'>Championship Results</Button>
        <Button className={'border px-6 rounded-2xl !bg-red-600 text-white'} color='danger' variant='solid'>Event Results</Button>
      </div>
    </section>
  );
};

export default PDFResultsTable;