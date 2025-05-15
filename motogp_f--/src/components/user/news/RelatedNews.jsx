import React from "react";
import { Typography, Card, Row, Col, Tag } from "antd";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import { CalendarOutlined } from "@ant-design/icons";
import {
  formatNewsDate,
  getStandardArticleType,
  getArticleTypeColor,
} from "../../../utils/formatters.jsx";

const { Title, Paragraph } = Typography;

const RelatedNews = ({ articles, currentArticleId }) => {
  // Filter out the current article and take up to 4 related articles
  const relatedArticles = articles
    .filter((article) => article.id !== currentArticleId)
    .slice(0, 4);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <Row gutter={[24, 24]}>
      {relatedArticles.map((article) => {
        // Use standardized formatters from utils
        const formattedDate = formatNewsDate(article.publishDate);
        const articleType = getStandardArticleType(article.articleType);
        const tagColor = getArticleTypeColor(article.articleType);

        return (
          <Col xs={24} sm={12} md={6} key={article.id}>
            <Link to={`/news/${article.id}`} className="block h-full">
              <Card
                hoverable
                className="h-full flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                cover={
                  <div className="relative h-[160px] overflow-hidden">
                    <img
                      alt={article.title}
                      src={getImageUrl(article.imageUrl)}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {articleType && (
                      <Tag color={tagColor} className="absolute top-2 right-2">
                        {articleType}
                      </Tag>
                    )}
                  </div>
                }
                bodyStyle={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px",
                }}
              >
                <Title level={5} ellipsis={{ rows: 2 }} className="mb-2">
                  {article.title}
                </Title>

                <div className="mt-auto pt-2 text-gray-500 flex items-center text-sm">
                  <CalendarOutlined className="mr-1" /> {formattedDate}
                </div>
              </Card>
            </Link>
          </Col>
        );
      })}
    </Row>
  );
};

export default RelatedNews;
