import React, { useEffect } from 'react';
import { Modal, Form, Input, Spin } from 'antd';

const CategoryFormModal = ({
                             visible,
                             onClose,
                             onSubmit,
                             initialData,
                             loading,
                             mode, // 'add' or 'edit'
                           }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
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

  const title = mode === 'edit' ? 'Edit Category' : 'Add New Category';

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose // Reset form fields when modal is closed
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" name="category_form">
          {mode === 'add' && ( // Only show categoryId field in 'add' mode if it's user-defined
            <Form.Item
              name="categoryId"
              label="Category ID"
              rules={[{ required: true, message: 'Please input the category ID!' }]}
            >
              <Input placeholder="Enter unique category ID" />
            </Form.Item>
          )}
          {mode === 'edit' && initialData && (
            <Form.Item
              label="Category ID"
            >
              <Input value={initialData.categoryId} disabled />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please input the category name!' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CategoryFormModal;