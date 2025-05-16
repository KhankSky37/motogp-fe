import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import ImageUploadField from "../../../components/admin/shared/ImageUploadField.jsx"; // Import ImageUploadField

const { Title } = Typography;
const { Option } = Select;

const AdminNewsArticleCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [articleTypes] = useState([
    "Latest MotoGP™ News",
    "News by GP",
    "MotoGP™ Grand Prix and Test reports",
    "Latest Moto2™ & Moto3™ News",
    "Official Communications",
  ]);

  const onFinish = useCallback(
    async (values) => {
      setLoading(true);

      const photoFile = values.photo; // Lấy file ảnh từ form values

      const newsArticleDto = {
        title: values.title,
        publishDate: values.publishDate
          ? values.publishDate.toISOString()
          : null,
        // imageUrl sẽ được backend xử lý và lưu, không cần gửi từ client nữa
        // imageUrl: values.imageUrl,
        articleLink: values.articleLink,
        articleType: values.articleType,
      };

      try {
        // Gọi service với DTO và file ảnh
        await NewsArticleService.createNewsArticle(newsArticleDto, photoFile);
        messageApi.success("News article created successfully!");
        form.resetFields();
        navigate("/admin/news-articles", {
          state: { successMessage: "News article created successfully!" },
        });
      } catch (error) {
        console.error("Failed to create news article:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to create news article. Please try again.";
        messageApi.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [form, messageApi, navigate]
  );

  const handleCancel = useCallback(() => {
    navigate("/admin/news-articles");
  }, [navigate]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="mr-2"
              aria-label="Back"
            />
            Create New News Article
          </div>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelAlign="left"
          requiredMark="optional"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="photo"
            label="Article Image"
            rules={[
              { required: true, message: "Please upload an article image!" },
            ]}
          >
            <ImageUploadField />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input placeholder="Enter article title" />
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="Publish Date"
            rules={[
              { required: true, message: "Please select the publish date!" },
            ]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            name="articleLink"
            label="Article Link"
            rules={[
              { required: true, message: "Please input the article link!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
          >
            <Input placeholder="Enter URL to the full article" />
          </Form.Item>

          <Form.Item
            name="articleType"
            label="Article Type"
            rules={[
              { required: true, message: "Please select the article type!" },
            ]}
          >
            <Select placeholder="Select article type">
              {articleTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className={"border-t pt-4 mt-4"}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Article
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminNewsArticleCreate;
