import React from 'react';
import {Descriptions, Image as AntImage, Modal, Tag, Typography} from 'antd';
import {formatDate} from '../../../utils/formatters';
import {getImageUrl} from '../../../utils/urlHelpers';

const {Link, Paragraph, Text} = Typography;

const NewsArticleDetailModal = ({article, visible, onClose}) => {
  if (!article) {
    return null;
  }

  return (
    <Modal
      title={`News Article Details`}
      open={visible} // Sử dụng 'open' cho Antd v5+
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={{xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1}} size={"small"}>
        <Descriptions.Item label="Image" span={1}>
          {article.imageUrl ? (
            <AntImage
              width={100} // Điều chỉnh kích thước preview
              src={getImageUrl(article.imageUrl)}
              alt={article.title || 'Article Image'}
              // style={{objectFit: 'contain', border: '1px solid #f0f0f0'}}
            />
          ) : (
            'No Image'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Article ID" span={1}>{article.id || 'N/A'}</Descriptions.Item>

        <Descriptions.Item label="Title" span={1}>{article.title || 'N/A'}</Descriptions.Item>

        <Descriptions.Item label="Article Type" span={1}>
          {article.articleType ? <Tag color="blue">{article.articleType}</Tag> : 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="Publish Date" span={1}>
          {article.publishDate ? formatDate(article.publishDate, 'YYYY-MM-DD HH:mm:ss') : 'N/A'}
        </Descriptions.Item>


        <Descriptions.Item label="Article Link" span={1}>
          {article.articleLink ? (
            <Link href={article.articleLink} target="_blank" rel="noopener noreferrer">
              {article.articleLink}
            </Link>
          ) : (
            'N/A'
          )}
        </Descriptions.Item>

        {article.createdDate && (
          <Descriptions.Item label="Created Date" span={1}>
            {formatDate(article.createdDate, 'YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        )}
        {article.createUser && (
          <Descriptions.Item label="Created By" span={1}>
            {article.createUser}
          </Descriptions.Item>
        )}
        {article.modifiedDate && (
          <Descriptions.Item label="Last Modified Date" span={1}>
            {formatDate(article.modifiedDate, 'YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
        )}
        {article.modifiedUser && (
          <Descriptions.Item label="Last Modified By" span={1}>
            {article.modifiedUser}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default NewsArticleDetailModal;