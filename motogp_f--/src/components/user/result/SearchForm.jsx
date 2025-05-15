import React from 'react';
import {Col, ConfigProvider, Form, Row, Select, theme} from "antd";

const SearchForm = ({form, seasonYears, eventsList, availableCategories, availableSessions}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Form form={form} name="motogp_search" layout="vertical">
        <Row gutter={16}>
          <Col md={24} lg={4}>
            <Form.Item name="year">
              <Select placeholder="Select Year">
                {seasonYears.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col md={24} lg={4}>
            <Form.Item name="type">
              <Select placeholder="Select Type" defaultValue={"ALL"}>
                <Option key="ALL" value="ALL">
                  All Events
                </Option>
                <Option key="GRAND_PRIX" value="GRAND_PRIX">
                  Grands Prix
                </Option>
              </Select>
            </Form.Item>
          </Col>

          <Col md={24} lg={4}>
            <Form.Item name="event">
              <Select
                placeholder="Select Event"
                showSearch
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {eventsList.map((event) => (
                  <Option key={event.id} value={event.id}>
                    {event.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col md={24} lg={4}>
            <Form.Item name="category">
              <Select placeholder="Select Category">
                {availableCategories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col md={24} lg={4}>
            <Form.Item name="session">
              <Select placeholder="Select Session">
                {availableSessions.map((session) => (
                  <Option key={session} value={session}>
                    {session}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ConfigProvider>
  );
};

export default SearchForm;