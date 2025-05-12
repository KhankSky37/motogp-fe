import React, {useCallback, useEffect, useState} from 'react';
import {Form, Input, message, Modal, Select, Spin} from 'antd';
import TeamService from '../../../services/TeamService.jsx';
import RiderService from '../../../services/RiderService.jsx';
import SeasonService from '../../../services/SeasonService.jsx';
import CategoryService from '../../../services/CategoryService.jsx';

const {Option} = Select;

const ContractFormModal = ({
                             visible,
                             onClose,
                             onSubmit,
                             initialData,
                             loading,
                             mode, // 'add' or 'edit'
                           }) => {
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [riders, setRiders] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchRelatedData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [teamsRes, ridersRes, seasonsRes, categoriesRes] = await Promise.all([
        TeamService.getAllTeams(),
        RiderService.getAllRiders(), // Assuming this fetches all riders needed
        SeasonService.getAllSeasons(),
        CategoryService.getAllCategories(),
      ]);
      setTeams(teamsRes.data?.content || teamsRes.data || []);
      setRiders(ridersRes.data?.content || ridersRes.data || []);
      setSeasons(seasonsRes.data || []); // Assuming seasonsRes.data is an array
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch related data for contract form:", error);
      message.error("Failed to load data for dropdowns. Please try again.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchRelatedData();
      if (mode === 'edit' && initialData) {
        form.setFieldsValue({
          ...initialData,
          // Ensure IDs are correctly set for Select components
          teamId: initialData.teamId,
          riderId: initialData.riderId,
          seasonId: initialData.seasonId,
          categoryId: initialData.categoryId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form, mode, fetchRelatedData]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const title = mode === 'edit' ? 'Edit Contract' : 'Add New Contract';

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Spin spinning={dataLoading || loading}>
        <Form form={form} layout="vertical" name="contract_form">
          {mode === 'edit' && initialData && (
            <Form.Item label="Contract ID">
              <Input value={initialData.id} disabled/>
            </Form.Item>
          )}
          <Form.Item
            name="teamId"
            label="Team"
            rules={[{required: true, message: 'Please select a team!'}]}
          >
            <Select placeholder="Select team" loading={dataLoading} showSearch
                    filterOption={(input, option) =>
                      String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
            >
              {teams.map(team => <Option key={team.id} value={team.id}>{team.name} ({team.id})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="riderId"
            label="Rider"
            rules={[{required: true, message: 'Please select a rider!'}]}
          >
            <Select placeholder="Select rider" loading={dataLoading} showSearch
                    filterOption={(input, option) =>
                      String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
            >
              {riders.map(rider => <Option key={rider.riderId}
                                           value={rider.riderId}>{rider.firstName} {rider.lastName} ({rider.riderId})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="seasonId"
            label="Season"
            rules={[{required: true, message: 'Please select a season!'}]}
          >
            <Select placeholder="Select season" loading={dataLoading} showSearch
                    filterOption={(input, option) =>
                      String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
            >
              {seasons.map(season => <Option key={season.id} value={season.id}>{season.name} ({season.id})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{required: true, message: 'Please select a category!'}]}
          >
            <Select
              placeholder="Select category"
              loading={dataLoading}
              showSearch
              filterOption={(input, option) =>
                String(option?.children ?? '').toLowerCase().includes(input.toLowerCase()) // Ép kiểu sang String
              }
            >
              {categories.map(category => <Option key={category.categoryId}
                                                  value={category.categoryId}>{category.name} ({category.categoryId})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="riderRole"
            label="Rider Role"
            rules={[{
              required: true,
              message: 'Please select the rider role!'
            }]} // Có thể đặt là true nếu vai trò luôn cần thiết
          >
            <Select placeholder="Select rider role">
              <Option value="Factory Rider">Factory Rider</Option>
              <Option value="Satellite Rider">Satellite Rider</Option>
              <Option value="Test Rider">Test Rider</Option>
              <Option value="Replacement Rider">Replacement Rider</Option>
              <Option value="Wildcard Rider">Wildcard Rider</Option>
              {/* Bạn có thể thêm các vai trò khác nếu cần */}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ContractFormModal;