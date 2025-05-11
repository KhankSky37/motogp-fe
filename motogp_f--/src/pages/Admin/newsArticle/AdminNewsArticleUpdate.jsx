import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, DatePicker, Form, Image as AntImage, Input, message, Select, Spin, Typography} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import NewsArticleService from '../../../services/NewsArticleService.jsx';
import dayjs from 'dayjs';
import {getImageUrl} from '../../../utils/urlHelpers.jsx'; // For displaying current image

const {Title} = Typography;
const {Option} = Select; // Assuming you might use Select for articleType

const AdminNewsArticleUpdate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {id: articleId} = useParams(); // Get articleId from URL
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch article data on component mount
  useEffect(() => {
    const fetchArticleData = async () => {
      if (!articleId) return;
      setInitialLoading(true);
      try {
        const response = await NewsArticleService.getNewsArticleById(articleId);
        const articleData = response.data;

        const formattedData = {
          ...articleData,
          publishDate: articleData.publishDate ? dayjs(articleData.publishDate) : null,
        };
        form.setFieldsValue(formattedData);
        if (articleData.imageUrl) {
          setCurrentImageUrl(getImageUrl(articleData.imageUrl));
        }
      } catch (error) {
        console.error('Failed to fetch news article data:', error);
        messageApi.error('Failed to load news article data. Please try again.');
        navigate('/admin/news-articles');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchArticleData();
  }, [articleId, form, messageApi, navigate]);

  const onFinish = useCallback(async (values) => {
    setLoading(true);

    const newsArticleDto = {
      title: values.title,
      publishDate: values.publishDate ? values.publishDate.toISOString() : null,
      imageUrl: values.imageUrl, // Send the imageUrl string
      articleLink: values.articleLink,
      articleType: values.articleType,
    };

    try {
      await NewsArticleService.updateNewsArticle(articleId, newsArticleDto);
      messageApi.success('News article updated successfully!');
      navigate('/admin/news-articles', {
        state: {successMessage: 'News article updated successfully!'},
      });
    } catch (error) {
      console.error('Failed to update news article:', error);
      const errorMsg = error.response?.data?.message || 'Failed to update news article. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [articleId, messageApi, navigate]); // Removed form from dependencies

  const handleCancel = useCallback(() => {
    navigate('/admin/news-articles');
  }, [navigate]);

  // Update currentImageUrl when form's imageUrl field changes
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    if (url) {
      // Basic check for URL format, can be improved
      try {
        const validUrl = new URL(url);
        setCurrentImageUrl(getImageUrl(validUrl.pathname.startsWith('/') ? validUrl.pathname : `/${validUrl.pathname}`));
      } catch (_) {
        setCurrentImageUrl(''); // Clear preview if URL is invalid
      }
    } else {
      setCurrentImageUrl('');
    }
  };


  if (initialLoading) {
    return <Spin spinning={true} tip="Loading article data..." className="flex justify-center items-center h-64"/>;
  }

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined/>} onClick={handleCancel} className="mr-2" aria-label="Back"/>
          Update News Article
        </div>
      }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{required: true, message: 'Please input the title!'}]}
          >
            <Input placeholder="Enter article title"/>
          </Form.Item>

          {currentImageUrl && (
            <Form.Item label="Current Image">
              <AntImage
                width={200}
                src={currentImageUrl}
                alt="Current article image"
                style={{border: '1px solid #f0f0f0', objectFit: 'contain', marginBottom: '10px'}}
                onError={() => setCurrentImageUrl('')} // Clear if image fails to load
              />
            </Form.Item>
          )}

          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[
              {required: true, message: 'Please input the image URL!'},
              {type: 'url', message: 'Please enter a valid URL!'}
            ]}
          >
            <Input placeholder="Enter new image URL (e.g., /uploads/image.jpg or https://example.com/image.jpg)"
                   onChange={handleImageUrlChange}/>
          </Form.Item>


          <Form.Item
            name="publishDate"
            label="Publish Date"
            rules={[{required: true, message: 'Please select the publish date!'}]}
          >
            <DatePicker showTime style={{width: '100%'}} format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>

          <Form.Item
            name="articleLink"
            label="Article Link"
            rules={[
              {required: true, message: 'Please input the article link!'},
              {type: 'url', message: 'Please enter a valid URL!'}
            ]}
          >
            <Input placeholder="Enter URL to the full article"/>
          </Form.Item>

          <Form.Item
            name="articleType"
            label="Article Type"
            rules={[{required: true, message: 'Please input the article type!'}]}
          >
            {/* Using Select as in your AdminNewsArticleCreate.jsx */}
            <Select placeholder="Select article type">
              <Option value="latest motogp news">Latest MotoGP News</Option>
              <Option value="news by gp">News by GP</Option>
              <Option value="motogp grand prix and test reports">MotoGP™ Grand Prix and Test reports</Option>
              <Option value="latest moto2 & moto3 news">Latest Moto2™ & Moto3™ News</Option>
              <Option value="official communications">Official Communications</Option>
            </Select>
          </Form.Item>

          <Form.Item className={"border-t pt-4 mt-4"}>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Article
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminNewsArticleUpdate;