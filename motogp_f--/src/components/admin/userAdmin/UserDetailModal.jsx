import React from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'; // Import icon nếu cần
import { formatDate } from '../../../utils/formatters'; // Giả sử bạn có hàm này
import { getImageUrl } from '../../../utils/urlHelpers'; // Để hiển thị ảnh rider (nếu có)

const UserDetailModal = ({ user, visible, onClose }) => {
  if (!user) {
    return null;
  }

  const renderRiderFavourite = (rider) => {
    if (!rider) return 'N/A';
    const riderPhotoUrl = rider.photoUrl ? getImageUrl(rider.photoUrl) : null;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {riderPhotoUrl ? (
          <Avatar src={riderPhotoUrl} style={{ marginRight: 8 }} />
        ) : (
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
        )}
        {rider.firstName} {rider.lastName} ({rider.riderId})
      </div>
    );
  };

  return (
    <Modal
      title={`User Details: ${user.name || user.nickname || user.id}`}
      open={visible} // Sử dụng 'open' thay vì 'visible' cho Antd v5+
      onCancel={onClose}
      footer={null} // Không cần footer mặc định
      width={700}
    >
      <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }}>
        <Descriptions.Item label="User ID">{user.id || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color={user.role?.toLowerCase() === 'admin' ? 'volcano' : 'green'}>
            {user.role?.toUpperCase() || 'N/A'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Name">{user.name || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Surname">{user.surname || 'N/A'}</Descriptions.Item>

        <Descriptions.Item label="Nickname">{user.nickname || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email || 'N/A'}</Descriptions.Item>

        <Descriptions.Item label="Gender">{user.gender || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {user.dataOfBirth ? formatDate(user.dataOfBirth, 'YYYY-MM-DD') : 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Phone Number">{user.phoneNumber || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Favourite Rider" span={2}>
          {renderRiderFavourite(user.riderFavourite)}
        </Descriptions.Item>

        <Descriptions.Item label="Created Date">
          {user.createdDate ? formatDate(user.createdDate, 'YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Created By">{user.createUser || 'N/A'}</Descriptions.Item>

        <Descriptions.Item label="Last Modified Date">
          {user.modifiedDate ? formatDate(user.modifiedDate, 'YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Last Modified By">{user.modifiedUser || 'N/A'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserDetailModal;