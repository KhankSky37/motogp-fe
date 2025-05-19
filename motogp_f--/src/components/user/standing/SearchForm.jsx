import React from 'react';
import {Col, ConfigProvider, Form, Row, Select, theme} from "antd";

const SearchForm = ({form, seasonYears}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Form form={form} name="motogp_search" layout="vertical" size={"large"}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="year" label="Year">
              <Select placeholder="Select Year">
                {seasonYears.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="type" label="Championship">
              <Select placeholder="Select Championship" defaultValue={'rider'}>
                <Option key={'rider'} value={'rider'} label={'Rider Championship'}>
                  Rider Championship
                </Option>
                <Option key={'team'} value={'team'} label={'Team Championship'}>
                  Team Championship
                </Option>
                <Option key={'constructor'} value={'constructor'} label={'Constructor Championship'}>
                  Constructor Championship
                </Option>
                <Option key={'BMW'} value={'BMW'} label={'BMW W Award'}>
                  BMW W Award
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ConfigProvider>
  );
};

export default SearchForm;