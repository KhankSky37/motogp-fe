import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import { CalendarOutlined, RightOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../../utils/urlHelpers.jsx";
import { formatNewsDate } from "../../../utils/formatters.jsx";

const { Paragraph } = Typography;

const NewsArticleGrid = ({ articles, loading, articleType }) => {
  const [showAll, setShowAll] = useState(false);

  if (!articles || articles.length === 0) {
    return <div className="text-center p-8">No articles found</div>;
  }

  const displayArticles = showAll ? articles : articles.slice(0, 5);
  const hasMore = articles.length > 5;

  const handleImageClick = (articleLink, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (articleLink) {
      window.open(articleLink, "_blank");
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-6">
        {displayArticles.map((article) => {
          const formattedDate = formatNewsDate(article.publishDate);

          return (
            <div
              key={article.id}
              className="w-[400px] transition-transform duration-300 hover:scale-110"
            >
              <Card
                hoverable
                loading={loading}
                cover={
                  article.imageUrl && (
                    <div
                      className="relative cursor-pointer overflow-hidden"
                      style={{ height: "160px" }}
                    >
                      <img
                        alt={article.title}
                        src={getImageUrl(article.imageUrl)}
                        className="object-cover w-full h-full"
                        onClick={(e) =>
                          handleImageClick(article.articleLink, e)
                        }
                      />
                    </div>
                  )
                }
                className="h-full shadow-md transition-shadow duration-300"
                style={{ height: "280px" }}
                bodyStyle={{ padding: "16px", overflow: "visible" }}
              >
                <Link
                  to={`/news/${article.slug || article.id}`}
                  className="block"
                >
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflow: "visible",
                    }}
                    className="font-MGPText"
                  >
                    {article.title}
                  </Typography.Title>
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <span className="text-xs text-gray-500 flex items-center">
                      <CalendarOutlined className="mr-1" />
                      {formattedDate}
                    </span>
                  </div>
                </Link>
              </Card>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="text-center mt-8 pb-4">
          <Button
            type="default"
            onClick={() => setShowAll(!showAll)}
            className="hover:text-blue-600"
          >
            {showAll ? "Show Less" : `View More ${articleType} News`}{" "}
            <RightOutlined className={showAll ? "rotate-90" : ""} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsArticleGrid;
