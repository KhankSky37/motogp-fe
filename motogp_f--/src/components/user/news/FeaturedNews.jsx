import React from "react";
import { Row, Col, Card, Typography, Button, Tag, Space } from "antd";
import { ArrowRightOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import { formatNewsDate } from "../../../utils/formatters.jsx";

const { Title, Paragraph } = Typography;

const FeaturedNews = ({ heroArticle, featuredArticles }) => {
  if (!heroArticle && (!featuredArticles || featuredArticles.length === 0)) {
    return null;
  }

  return (
    <div>
      {/* Hero Article Section */}
      {heroArticle && (
        <div className="mb-10">
          <Card
            className="w-full overflow-hidden shadow-xl rounded-lg hover:shadow-2xl transition-all duration-300"
            bodyStyle={{ padding: 0 }}
            cover={
              <div className="relative h-[500px] md:h-[400px] lg:h-[500px] overflow-hidden">
                <img
                  src={getImageUrl(heroArticle.imageUrl)}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div className="absolute left-0 bottom-0 w-full p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag color="purple" className="text-sm">
                      FEATURED
                    </Tag>
                  </div>

                  <Title
                    level={1}
                    className="text-white mb-3 max-w-4xl text-2xl md:text-3xl lg:text-4xl"
                  >
                    {heroArticle.title}
                  </Title>

                  <Space className="mb-6 text-gray-300">
                    <CalendarOutlined />{" "}
                    {formatNewsDate(heroArticle.publishDate)}
                  </Space>

                  <Link to={`/news/${heroArticle.id}`}>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-blue-600 hover:bg-blue-700"
                      icon={<ArrowRightOutlined />}
                    >
                      Read Full Article
                    </Button>
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* Featured Articles Grid */}
      {featuredArticles && featuredArticles.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <Title level={2}>Featured Stories</Title>
          </div>
          <Row gutter={[24, 24]}>
            {featuredArticles.map((article) => (
              <Col xs={24} sm={12} lg={6} key={article.id}>
                <Link to={`/news/${article.id}`}>
                  <Card
                    hoverable
                    className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                    cover={
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getImageUrl(article.imageUrl)}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        {/* Overlay example: view more button/arrow, always inside this relative div */}
                        {/* <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-b w-full text-center">View More</div>
                        </div> */}
                      </div>
                    }
                    bodyStyle={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: "16px",
                    }}
                  >
                    <Title
                      level={5}
                      ellipsis={{ rows: 2 }}
                      className="mb-2 flex-grow"
                    >
                      {article.title}
                    </Title>

                    <div className="mt-auto pt-2">
                      <Paragraph type="secondary" className="mb-0 text-sm">
                        {formatNewsDate(article.publishDate)}
                      </Paragraph>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default FeaturedNews;
