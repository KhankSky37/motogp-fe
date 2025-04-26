import React from 'react';
import {Modal, Button, Descriptions, Image} from 'antd';
import {formatDate} from '../../../utils/formatters';
import {getImageUrl} from '../../../utils/urlHelpers';

const RiderDetailModal = ({rider, visible, onClose}) => {
  if (!rider) return null; // Don't render if no rider data

  const photoUrl = getImageUrl(rider.photoUrl);

  return (
    <Modal
      title="Rider Details"
      open={visible}
      onOk={onClose} // Simple close on OK
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose}>
          OK
        </Button>,
      ]}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Photo">
          {photoUrl ? (
            <Image width={100} src={photoUrl}
                   alt={`${rider.firstName || ''} ${rider.lastName || ''}`}
              // Optional: Add fallback for broken images
              // preview={{
              //     mask: <EyeOutlined />,
              // }}
            />
          ) : (
            'No Photo Available'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Rider ID">{rider.riderId || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="First Name">{rider.firstName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{rider.lastName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Nationality">{rider.nationality || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{formatDate(rider.dateOfBirth)}</Descriptions.Item>
        <Descriptions.Item label="Created Date">{formatDate(rider.createdDate)}</Descriptions.Item>
        <Descriptions.Item label="Create User">{rider.createUser || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Modified Date">{formatDate(rider.modifiedDate)}</Descriptions.Item>
        <Descriptions.Item label="Modified User">{rider.modifiedUser || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RiderDetailModal;