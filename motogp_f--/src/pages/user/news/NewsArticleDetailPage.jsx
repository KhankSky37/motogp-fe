import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Typography,
  Breadcrumb,
  Spin,
  Tag,
  Button,
  Row,
  Col,
  Divider,
  Image,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import UserLayout from "../../../layouts/UserLayout.jsx";
import RelatedNews from "../../../components/user/news/RelatedNews.jsx";
import {
  getStandardArticleType,
  getArticleTypeColor,
} from "../../../utils/formatters.jsx";

const { Title, Paragraph } = Typography;

const NewsArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // Fetch the current article
    NewsArticleService.getNewsArticleById(id)
      .then((response) => {
        const currentArticle = response.data;
        setArticle(currentArticle);

        // Fetch all articles to find related ones with same type
        return NewsArticleService.getAllNewsArticles().then((allResponse) => {
          const allArticles = allResponse.data;
          // Filter related articles by the same article type
          const related = allArticles
            .filter(
              (a) =>
                a.id !== id && // Not the current article
                a.articleType === currentArticle.articleType // Same article type
            )
            .slice(0, 4); // Limit to 4 related articles
          setRelatedArticles(related);
        });
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setError(
          "Failed to load article. It may have been removed or is temporarily unavailable."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Format the article type for display using standardized format
  const formatArticleType = (type) => {
    if (!type) return "Uncategorized";
    // Use the standardized article type format
    return getStandardArticleType(type) || type;
  };

  // Format publication date
  const formatPublishDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center py-24">
          <Spin size="large" tip="Loading article..." />
        </div>
      </UserLayout>
    );
  }

  if (error || !article) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-12">
          <Card className="shadow-md rounded-lg">
            <Title level={3} className="text-red-500">
              Error
            </Title>
            <Paragraph>{error || "Article not found"}</Paragraph>
            <Link to="/news">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Back to News
              </Button>
            </Link>
          </Card>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="bg-gradient-to-b from-gray-900 to-blue-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-6 text-white opacity-80"
            separator=">"
            itemRender={(route, params, items) => {
              return items.indexOf(route) === items.length - 1 ? (
                <span className="text-blue-200">{route.title}</span>
              ) : (
                <Link
                  to={route.path}
                  className="text-white hover:text-blue-200"
                >
                  {route.title}
                </Link>
              );
            }}
          >
            <Breadcrumb.Item title="Home" path="/" />
            <Breadcrumb.Item title="News" path="/news" />
            <Breadcrumb.Item title={formatArticleType(article.articleType)} />
          </Breadcrumb>

          <div className="max-w-4xl mx-auto text-center">
            <Title
              level={1}
              className="text-white mb-6 text-3xl sm:text-4xl md:text-5xl"
            >
              {article.title}
            </Title>

            <div className="flex flex-wrap justify-center items-center gap-4 text-white mb-6">
              <Space>
                <CalendarOutlined /> {formatPublishDate(article.publishDate)}
              </Space>

              {article.articleType && (
                <Tag
                  color={getArticleTypeColor(article.articleType)}
                  className="m-0"
                >
                  {formatArticleType(article.articleType)}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={24}>
          <Col xs={24} lg={16} className="mb-8 lg:mb-0">
            <Card className="shadow-lg rounded-lg overflow-hidden border-0">
              <div className="mb-8">
                <Image
                  src={getImageUrl(article.imageUrl)}
                  alt={article.title}
                  className="w-full rounded-lg"
                  preview={false}
                />
              </div>

              <div className="flex justify-between items-center mb-6">
                <Space className="text-gray-500">
                  <CalendarOutlined /> Published on{" "}
                  {formatPublishDate(article.publishDate)}
                </Space>

                <Space>
                  <Button
                    icon={<FacebookOutlined />}
                    shape="circle"
                    type="text"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                        "_blank"
                      )
                    }
                  />
                  <Button
                    icon={<TwitterOutlined />}
                    shape="circle"
                    type="text"
                    className="text-blue-400 hover:text-blue-600"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`,
                        "_blank"
                      )
                    }
                  />
                  <Button
                    icon={<LinkOutlined />}
                    shape="circle"
                    type="text"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                  />
                </Space>
              </div>

              <Divider />

              <div className="mt-8 text-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => window.open(article.articleLink, "_blank")}
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  Read Full Article on Official Website
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Article Information"
              className="shadow-md rounded-lg mb-6 sticky"
              style={{ top: "20px" }}
            >
              <div className="mb-4">
                <strong>Article Type:</strong>
                <div className="mt-1">
                  <Tag color={getArticleTypeColor(article.articleType)}>
                    {formatArticleType(article.articleType)}
                  </Tag>
                </div>
              </div>

              <div className="mb-4">
                <strong>Publication Date:</strong>
                <div className="mt-1">
                  {formatPublishDate(article.publishDate)}
                </div>
              </div>

              <div>
                <strong>External Link:</strong>
                <div className="mt-1">
                  <Button
                    type="link"
                    href={article.articleLink}
                    target="_blank"
                    className="p-0 flex items-center"
                  >
                    Visit Original Source{" "}
                    <ArrowLeftOutlined className="ml-1" rotate={-45} />
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <Divider>
              <Title level={3} className="my-0">
                Related News
              </Title>
            </Divider>
            <div className="mt-8">
              <RelatedNews articles={relatedArticles} currentArticleId={id} />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Link to="/news">
            <Button icon={<ArrowLeftOutlined />} size="large">
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    </UserLayout>
  );
};

export default NewsArticleDetailPage;
