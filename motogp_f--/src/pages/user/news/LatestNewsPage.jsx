import React, { useState, useEffect } from "react";
import { Tabs, Typography, Skeleton, Card, Row, Col, Button } from "antd";
import NewsArticleService from "../../../services/NewsArticleService.jsx";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import bgResults from "../../../assets/bg_results.png";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const LatestNewsPage = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [articleTypes] = useState([
    "Latest MotoGP™ News",
    "News by GP",
    "MotoGP™ Grand Prix and Test reports",
    "Latest Moto2™ & Moto3™ News",
    "Official MotoGP™ News",
  ]);
  const [activeTab, setActiveTab] = useState(articleTypes[0]);

  useEffect(() => {
    fetchArticles(activeTab);
  }, [activeTab]);

  const fetchArticles = (articleType) => {
    setLoading(true);
    const params = { articleType };

    NewsArticleService.getAllNewsArticles(params)
      .then((response) => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news articles:", error);
        setLoading(false);
      });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <>
      <div
        className="relative flex justify-center items-center h-[300px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgResults})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="mb-6"
          size="large"
          centered
        >
          {articleTypes.map((type) => (
            <TabPane tab={type} key={type} />
          ))}
        </Tabs>

        {loading ? (
          <div className="py-8">
            <Skeleton active paragraph={{ rows: 6 }} />
            <Row gutter={[24, 24]} className="mt-8">
              {[1, 2, 3].map((i) => (
                <Col xs={24} sm={12} md={8} key={i}>
                  <Card loading={true} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <>
                {/* Featured article */}
                <div className="mb-10">
                  <Card className="overflow-hidden" bodyStyle={{ padding: 0 }}>
                    <Row>
                      <Col xs={24} md={16}>
                        <div className="relative" style={{ width: 400, height: 200 }}>
                          <img
                            src={getImageUrl(articles[0].imageUrl)}
                            alt={articles[0].title}
                            style={{ width: 400, height: 200, objectFit: 'cover' }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} md={8}>
                        <div className="p-6 h-full flex flex-col justify-between">
                          <div>
                            <Title level={3}>{articles[0].title}</Title>
                            <Paragraph className="text-gray-500">
                              {new Date(
                                articles[0].publishDate
                              ).toLocaleDateString()}
                            </Paragraph>
                          </div>
                          <Button type="primary" size="large" className="mt-4">
                            <a
                              href={articles[0].articleLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Read More
                            </a>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>

                {/* List of articles */}
                <Row gutter={[24, 24]}>
                  {articles.slice(1).map((article, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      key={article.id || index}
                    >
                      <Card
                        hoverable
                        className="h-full flex flex-col"
                        cover={
                          <div style={{ width: 400, height: 200, overflow: 'hidden' }}>
                            <img
                              alt={article.title}
                              src={getImageUrl(article.imageUrl)}
                              style={{ width: 400, height: 200, objectFit: 'cover' }}
                            />
                          </div>
                        }
                      >
                        <Title
                          level={4}
                          ellipsis={{ rows: 2 }}
                          className="mb-2"
                        >
                          {article.title}
                        </Title>
                        <Paragraph className="text-gray-500 mb-4">
                          {new Date(article.publishDate).toLocaleDateString()}
                        </Paragraph>
                        <div className="mt-auto">
                          <a
                            href={article.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Read more
                          </a>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <div className="text-center py-10">
                <Title level={4} className="text-gray-500">
                  No news articles available
                </Title>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LatestNewsPage;
