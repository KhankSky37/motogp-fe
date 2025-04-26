import React, { useCallback, useEffect, useState } from 'react';
import { Button, Image, Tooltip, Upload, message } from 'antd'; // Import message
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../utils/urlHelpers'; // Import helper nếu cần tạo URL đầy đủ

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUploadField = ({
                            value = null, // Nhận value từ Form.Item
                            onChange,     // Callback để cập nhật Form.Item
                            maxSizeMB = 2,
                            acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
                          }) => {
  // Không cần internalFileList nữa vì Antd Upload quản lý file list khi dùng onChange
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [messageApi, contextHolder] = message.useMessage(); // Dùng messageApi nội bộ

  // Effect để xử lý giá trị value ban đầu (URL ảnh hoặc null)
  useEffect(() => {
    if (typeof value === 'string' && value) {
      // Nếu value là string (URL ảnh ban đầu), hiển thị nó
      // Giả sử value là đường dẫn tương đối, cần getImageUrl nếu backend trả về vậy
      // const fullUrl = getImageUrl(value); // Bỏ comment nếu cần
      // setPreviewImageUrl(fullUrl || '');
      setPreviewImageUrl(value); // Nếu value đã là URL đầy đủ hoặc ImageUploadField xử lý được
    } else if (value instanceof File) {
      // Nếu value ban đầu là File (ít gặp hơn cho update, nhưng xử lý cho chắc)
      getBase64(value).then(url => setPreviewImageUrl(url)).catch(() => setPreviewImageUrl(''));
    }
    else {
      // Nếu value là null hoặc không hợp lệ, không hiển thị preview
      setPreviewImageUrl('');
    }
  }, [value]); // Chạy lại khi value từ Form thay đổi

  // Xử lý khi người dùng chọn file mới
  const handleInternalUploadChange = useCallback(async ({ file, fileList }) => {
    // fileList là danh sách file do Antd Upload quản lý
    const latestFile = fileList.slice(-1)[0]; // Lấy file mới nhất

    if (latestFile && latestFile.originFileObj) {
      const currentFile = latestFile.originFileObj;

      // Validation (đã có trong beforeUpload nhưng check lại cho chắc)
      const isValidType = acceptedTypes.includes(currentFile.type);
      const isValidSize = currentFile.size / 1024 / 1024 < maxSizeMB;

      if (!isValidType || !isValidSize) {
        // Lỗi đã được hiển thị bởi beforeUpload, không cần setUploadError ở đây
        // Chỉ cần đảm bảo không gọi onChange với file không hợp lệ
        onChange?.(null); // Reset giá trị trong Form nếu file không hợp lệ
        setPreviewImageUrl(''); // Xóa preview
        return;
      }

      // Nếu file hợp lệ, tạo preview và gọi onChange để cập nhật Form
      setUploadError('');
      try {
        const previewUrl = await getBase64(currentFile);
        setPreviewImageUrl(previewUrl);
        onChange?.(currentFile); // *** Gọi onChange với File object ***
      } catch (error) {
        console.error("Error creating base64 preview:", error);
        setPreviewImageUrl('');
        setUploadError("Could not generate image preview.");
        onChange?.(null);
      }
    } else if (file && file.status === 'removed') {
      // Xử lý khi file bị xóa khỏi Upload component (nếu showUploadList=true)
      // Hoặc khi nút xóa tùy chỉnh được nhấn (xem handleInternalRemove)
    }
  }, [onChange, acceptedTypes, maxSizeMB]);

  // Xử lý khi nhấn nút xóa tùy chỉnh
  const handleInternalRemove = useCallback(() => {
    setPreviewImageUrl('');
    setUploadError('');
    onChange?.(null); // *** Gọi onChange với null để xóa giá trị trong Form ***
  }, [onChange]);

  // Kiểm tra file trước khi thêm vào danh sách (và ngăn upload tự động)
  const handleBeforeUpload = useCallback((file) => {
    const isValidType = acceptedTypes.includes(file.type);
    if (!isValidType) {
      messageApi.error(`Invalid file type. Only ${acceptedTypes.join(', ')} allowed.`);
      setUploadError(`Invalid file type. Only ${acceptedTypes.join(', ')} allowed.`);
      return Upload.LIST_IGNORE; // Ngăn file hiển thị trong danh sách
    }
    const isValidSize = file.size / 1024 / 1024 < maxSizeMB;
    if (!isValidSize) {
      messageApi.error(`Image must be smaller than ${maxSizeMB}MB!`);
      setUploadError(`Image must be smaller than ${maxSizeMB}MB!`);
      return Upload.LIST_IGNORE;
    }
    setUploadError(''); // Xóa lỗi cũ nếu file mới hợp lệ
    // Return false để ngăn upload tự động, file sẽ được xử lý trong onChange
    return false;
  }, [acceptedTypes, maxSizeMB, messageApi]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="flex items-start gap-2">
      {contextHolder} {/* Để hiển thị messageApi */}
      {previewImageUrl && (
        <div className="relative h-[102px] w-[102px]">
          <Image
            width="100%"
            height="100%"
            src={previewImageUrl}
            alt="Preview"
            className="border border-gray-300 p-1 object-contain"
            preview={{ src: previewImageUrl }}
          />
          <Tooltip title="Remove image">
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={handleInternalRemove} // Gọi hàm xóa tùy chỉnh
              className="absolute right-[-8px] top-[-8px] z-10 rounded-full shadow-md"
              aria-label="Remove image"
              danger
              type="primary"
            />
          </Tooltip>
        </div>
      )}

      {/* Chỉ hiển thị nút Upload khi chưa có ảnh preview */}
      {!previewImageUrl && (
        <div>
          <Upload
            listType="picture-card"
            beforeUpload={handleBeforeUpload}
            onChange={handleInternalUploadChange} // onChange sẽ nhận fileList từ Antd
            maxCount={1}
            accept={acceptedTypes.join(',')}
            showUploadList={false} // Không hiển thị danh sách file mặc định của Antd
            // fileList={[]} // Không cần quản lý fileList ở đây nữa nếu dùng onChange đúng cách
          >
            {uploadButton}
          </Upload>
          {uploadError && <div className="text-red-500 mt-1">{uploadError}</div>}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;