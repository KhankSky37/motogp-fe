import React from 'react';
import { Modal, Descriptions, Typography } from 'antd';
import { formatDate } from '../../../utils/formatters'; // Assuming you have this

const { Text } = Typography;

const CategoryDetailModal = ({ category, visible, onClose }) => {
  if (!category) {
    return null;
  }

  return (
    <Modal
      title="Category Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Category ID">{category.categoryId || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Name">{category.name || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {category.createdDate ? formatDate(category.createdDate, 'YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">{category.createUser || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Last Modified Date">
          {category.modifiedDate ? formatDate(category.modifiedDate, 'YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified By">{category.modifiedUser || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CategoryDetailModal;