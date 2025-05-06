import React from 'react';
import {Modal, Button, Descriptions} from 'antd';
import {formatDate} from '../../../utils/formatters';

const SeasonDetailModal = ({season, visible, onClose}) => {
  if (!season) return null; // Don't render if no season data

  return (
    <Modal
      title="Season Details"
      open={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Season ID">{season.id || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Name">{season.name || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Created Date">{formatDate(season.createdDate)}</Descriptions.Item>
        <Descriptions.Item label="Created By">{season.createUser || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Modified Date">{formatDate(season.modifiedDate)}</Descriptions.Item>
        <Descriptions.Item label="Modified By">{season.modifiedUser || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default SeasonDetailModal;