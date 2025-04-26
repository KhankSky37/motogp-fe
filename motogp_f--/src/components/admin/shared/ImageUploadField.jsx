import React, {useCallback, useEffect, useState} from 'react';
import {Button, Image, Tooltip, Upload} from 'antd';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUploadField = ({
                            value = null,
                            onChange,
                            maxSizeMB = 2,
                            acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
                          }) => {
  const [internalFileList, setInternalFileList] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const setupPreview = async () => {
      if (value instanceof File) {
        try {
          const url = await getBase64(value);
          setPreviewImageUrl(url);
          setInternalFileList([{
            uid: '-1',
            name: value.name,
            status: 'done',
            originFileObj: value,
            url: url,
          }]);
          setUploadError('');
        } catch (error) {
          console.error("Error creating initial preview:", error);
          setPreviewImageUrl('');
          setInternalFileList([]);
          setUploadError('Could not generate preview.');
        }
      } else if (typeof value === 'string' && value.startsWith('http')) {
        setPreviewImageUrl(value);
        setInternalFileList([{
          uid: '-1',
          name: 'existing-image.jpg',
          status: 'done',
          url: value,
        }]);
        setUploadError('');
      } else {
        setPreviewImageUrl('');
        setInternalFileList([]);
        setUploadError('');
      }
    };
    setupPreview();
  }, [value]);

  const handleInternalUploadChange = useCallback(async ({fileList: newFileList}) => {
    const latestFile = newFileList.slice(-1);

    if (latestFile.length > 0 && latestFile[0].originFileObj) {
      const file = latestFile[0].originFileObj;
      const isValidType = acceptedTypes.includes(file.type);
      const isValidSize = file.size / 1024 / 1024 < maxSizeMB;

      if (!isValidType) {
        setUploadError(`Invalid file type. Only ${acceptedTypes.join(', ')} allowed.`);
        return;
      }
      if (!isValidSize) {
        setUploadError(`Image must be smaller than ${maxSizeMB}MB!`);
        return;
      }

      setUploadError('');
      try {
        const previewUrl = await getBase64(file);
        setPreviewImageUrl(previewUrl);
        onChange?.(file);
      } catch (error) {
        console.error("Error creating base64 preview:", error);
        setPreviewImageUrl('');
        setUploadError("Could not generate image preview.");
        onChange?.(null);
      }
    }
  }, [onChange, acceptedTypes, maxSizeMB]);

  const handleInternalRemove = useCallback(() => {
    setPreviewImageUrl('');
    setInternalFileList([]);
    setUploadError('');
    onChange?.(null);
  }, [onChange]);

  const handleBeforeUpload = useCallback((file) => {
    const isValidType = acceptedTypes.includes(file.type);
    if (!isValidType) {
      setUploadError(`Invalid file type. Only ${acceptedTypes.join(', ')} allowed.`);
      return Upload.LIST_IGNORE;
    }
    const isValidSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isValidSize) {
      setUploadError(`Image must be smaller than ${maxSizeMB}MB!`);
      return Upload.LIST_IGNORE;
    }
    setUploadError('');
    return false;
  }, [acceptedTypes, maxSizeMB]);

  const uploadButton = (
    <div>
      <PlusOutlined/>
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  return (
    <div className="flex items-start gap-2">
      {previewImageUrl && (
        <div className="relative h-[102px] w-[102px]">
          <Image
            width="100%"
            height="100%"
            src={previewImageUrl}
            alt="Preview"
            className="border border-gray-300 p-1 object-contain"
            preview={{src: previewImageUrl}}
          />
          <Tooltip title="Remove image">
            <Button
              icon={<CloseOutlined/>}
              size="small"
              onClick={handleInternalRemove}
              className="absolute right-[-8px] top-[-8px] z-10 rounded-full shadow-md"
              aria-label="Remove image"
              danger
              type="primary"
            />
          </Tooltip>
        </div>
      )}

      {!previewImageUrl && (
        <div>
          <Upload
            listType="picture-card"
            beforeUpload={handleBeforeUpload}
            onChange={handleInternalUploadChange}
            maxCount={1}
            accept={acceptedTypes.join(',')}
            showUploadList={false}
          >
            {uploadButton}
          </Upload>
          {uploadError && <div style={{color: 'red', marginTop: '4px'}}>{uploadError}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;