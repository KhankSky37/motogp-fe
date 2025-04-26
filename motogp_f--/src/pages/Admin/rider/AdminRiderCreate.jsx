import React, {useCallback, useState} from 'react';
import {Button, Card, DatePicker, Form, Image, Input, message, Select, Spin, Tooltip, Upload,} from 'antd';
import {ArrowLeftOutlined, CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import RiderService from '../../../services/RiderService.jsx';
import {COUNTRIES} from '../../../constants/Countries.jsx';

const {Option} = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AdminRiderCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const handleUploadChange = useCallback(async ({fileList: newFileList}) => {
    const latestFile = newFileList.slice(-1);
    setFileList(latestFile);

    if (latestFile.length > 0 && latestFile[0].originFileObj) {
      try {
        const previewUrl = await getBase64(latestFile[0].originFileObj);
        setPreviewImageUrl(previewUrl);
      } catch (error) {
        console.error("Error creating base64 preview:", error);
        setPreviewImageUrl('');
        messageApi.error("Could not generate image preview.");
      }
    } else {
      setPreviewImageUrl('');
    }
  }, [messageApi]);

  const beforeUpload = useCallback((file) => {
    const isJpgOrPngOrWebp = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    if (!isJpgOrPngOrWebp) {
      messageApi.error('You can only upload JPG/PNG/WEBP file!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error('Image must smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  }, [messageApi]);

  const handleRemove = useCallback(() => {
    setFileList([]);
    setPreviewImageUrl('');
  }, []);

  const onFinish = useCallback(async (values) => {
    if (fileList.length === 0) {
      messageApi.error('Please upload a rider photo!');
      return;
    }

    setLoading(true);
    const photoFile = fileList[0]?.originFileObj;

    const riderDto = {
      riderId: values.riderId,
      firstName: values.firstName,
      lastName: values.lastName,
      nationality: values.nationality,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
    };

    try {
      await RiderService.createRider(riderDto, photoFile);
      messageApi.success('Rider created successfully!');
      form.resetFields();
      setFileList([]);
      setPreviewImageUrl('');
      navigate('/admin/riders');
    } catch (error) {
      console.error('Failed to create rider:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create rider. Please try again.';
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fileList, form, messageApi, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/riders');
  }, [navigate]);


  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Card title={
        <div className="flex items-center">
          <Button type="text" icon={<ArrowLeftOutlined/>} onClick={handleCancel} className="mr-2" aria-label="Back"/>
          Create New Rider
        </div>
      }>
        <Form
          form={form}
          layout="horizontal"
          labelAlign={"left"}
          requiredMark={"optional"}
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          onFinish={onFinish}
          initialValues={{}}
          autoComplete="off"
        >
          <Form.Item
            label="Photo"
          >
            <div style={{display: 'flex', alignItems: 'flex-start', gap: '8px'}}>
              {previewImageUrl && (
                <div style={{position: 'relative', width: 102, height: 102}}>
                  <Image
                    width="100%"
                    height="100%"
                    src={previewImageUrl}
                    alt="Rider preview"
                    style={{border: '1px solid #d9d9d9', padding: '4px', objectFit: 'contain'}}
                    preview={{
                      src: previewImageUrl,
                    }}
                  />
                  <Tooltip title="Remove image">
                    <Button
                      icon={<CloseOutlined/>}
                      size="small"
                      onClick={handleRemove}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      }}
                      aria-label="Remove image"
                    />
                  </Tooltip>
                </div>
              )}

              {!previewImageUrl && (
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onChange={handleUploadChange}
                  maxCount={1}
                  accept="image/png, image/jpeg, image/webp"
                  showUploadList={false}
                >
                  <div>
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
              )}

            </div>
          </Form.Item>

          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[
              {required: true, message: 'Please input the Rider ID!'},
            ]}
          >
            <Input placeholder="Enter Rider ID (e.g., VR46)"/>
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{required: true, message: 'Please input the first name!'}]}
          >
            <Input placeholder="Enter first name"/>
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{required: true, message: 'Please input the last name!'}]}
          >
            <Input placeholder="Enter last name"/>
          </Form.Item>

          <Form.Item
            name="nationality"
            label="Nationality"
            rules={[{required: true, message: 'Please select the nationality!'}]}
          >
            <Select placeholder="Select nationality" allowClear>
              {COUNTRIES.map(country => (
                <Option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{required: true, message: 'Please select the date of birth!'}]}
          >
            <DatePicker style={{width: '100%'}} format="YYYY-MM-DD"/>
          </Form.Item>

          <Form.Item wrapperCol={{offset: 6, span: 18}} className={"border-t pt-4 mt-4"}>
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Rider
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AdminRiderCreate;