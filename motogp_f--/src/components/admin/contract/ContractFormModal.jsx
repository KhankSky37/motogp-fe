import React, { useEffect } from 'react'; // Bỏ useCallback, useState, message
import { Modal, Form, Input, Select, Spin } from 'antd';
// Bỏ import các Service (TeamService, RiderService, SeasonService, CategoryService)

const { Option } = Select;

const ContractFormModal = ({
                             visible,
                             onClose,
                             onSubmit,
                             initialData,
                             loading,
                             mode,
                             teamsData = [],
                             ridersData = [],
                             seasonsData = [],
                             categoriesData = [],
                             dataLoading = false,
                           }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    if (visible) {
      // Không cần fetchRelatedData() ở đây nữa
      if (mode === 'edit' && initialData) {
        form.setFieldsValue({
          ...initialData,
          teamId: initialData.teamId,
          riderId: initialData.riderId,
          seasonId: initialData.seasonId,
          categoryId: initialData.categoryId,
        });
      } else {
        form.resetFields();
        // Khi thêm mới, trường ID sẽ được người dùng nhập
      }
    }
  }, [visible, initialData, form, mode]);

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
      confirmLoading={loading} // Loading cho nút OK (khi submit)
      destroyOnClose
      width={600}
    >
      {/* Spin này sẽ dựa vào dataLoading từ parent */}
      <Spin spinning={dataLoading}>
        <Form form={form} layout="vertical" name="contract_form">
          {/* Khi edit, hiển thị ID nhưng không cho sửa */}
          {mode === 'edit' && initialData && (
            <Form.Item label="Contract ID">
              <Input value={initialData.id} disabled />
            </Form.Item>
          )}
          <Form.Item
            name="teamId"
            label="Team"
            rules={[{ required: true, message: 'Please select a team!' }]}
          >
            <Select placeholder="Select team" loading={dataLoading} showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {teamsData.map(team => <Option key={team.id} value={team.id} label={`${team.name} (${team.id})`}>{team.name} ({team.id})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="riderId"
            label="Rider"
            rules={[{ required: true, message: 'Please select a rider!' }]}
          >
            <Select placeholder="Select rider" loading={dataLoading} showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {ridersData.map(rider => <Option key={rider.riderId} value={rider.riderId} label={`${rider.firstName} ${rider.lastName} (${rider.riderId})`}>{rider.firstName} {rider.lastName} ({rider.riderId})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="seasonId"
            label="Season"
            rules={[{ required: true, message: 'Please select a season!' }]}
          >
            <Select placeholder="Select season" loading={dataLoading} showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {seasonsData.map(season => <Option key={season.id} value={season.id} label={`${season.name} (${season.id})`}>{season.name} ({season.id})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select category" loading={dataLoading} showSearch filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}>
              {categoriesData.map(category => <Option key={category.categoryId} value={category.categoryId} label={`${category.name} (${category.categoryId})`}>{category.name} ({category.categoryId})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            name="riderRole"
            label="Rider Role"
            rules={[{ required: true, message: 'Please select the rider role!'}]}
          >
            <Select placeholder="Select rider role">
              <Option value="Factory Rider">Factory Rider</Option>
              <Option value="Satellite Rider">Satellite Rider</Option>
              <Option value="Test Rider">Test Rider</Option>
              <Option value="Replacement Rider">Replacement Rider</Option>
              <Option value="Wildcard Rider">Wildcard Rider</Option>
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ContractFormModal;