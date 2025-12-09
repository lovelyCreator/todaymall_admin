import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  PlusOutlined,
  PictureOutlined,
  EyeOutlined,
  BarsOutlined,
  ApartmentOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Select,
  Space,
  Switch,
  Tag,
  Image,
  Checkbox,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCategoryTree, 
  updateCategory, 
  updateCategoryStatus, 
  updateCategoryImage, 
  updateCategoryName 
} from '@/services/ant-design-pro/api';
import { useCategoryStore } from '@/stores/categoryStore';
// @ts-ignore: Could not find a declaration file for module
import type * as API from '@/services/ant-design-pro/typings';

const { Option } = Select;
const { TextArea } = Input;

interface CategoryTableItem extends API.Category {
  level: any;
  imageUrl: any;
  isActive: any;
  createdAt: any;
  key: string;
  displayName: string;
  displayNameEn?: string;
  displayNameZh?: string;
  displayNameKo?: string;
  parentName?: string; // Parent category display name
  parentId?: string | null;
  children?: CategoryTableItem[]; // For expandable rows
}

// Get display name based on locale
const getDisplayName = (category: API.Category, locale: string): string => {
  // Map locale to name key
  const localeMap: Record<string, 'ko' | 'en' | 'zh'> = {
    'ko-KR': 'ko',
    'en-US': 'en',
    'zh-CN': 'zh',
  };
  
  const nameKey = localeMap[locale] || 'ko';
  
  // Try to get name in preferred locale, fallback to others
  if (nameKey === 'ko') {
    return category.name?.ko || category.name?.en || category.name?.zh || '';
  } else if (nameKey === 'en') {
    return category.name?.en || category.name?.ko || category.name?.zh || '';
  } else {
    return category.name?.zh || category.name?.ko || category.name?.en || '';
  }
};

// Convert tree structure to table items with children for expandable rows
const convertCategoriesToTableItems = (
  categories: API.Category[],
  locale: string,
  level: number = 0,
  parentName?: string,
  parentId?: string | null,
): CategoryTableItem[] => {
  return categories.map((category) => {
    const key = category._id || '';
    
    // Get display name based on locale
    const displayName = getDisplayName(category, locale);
    const displayNameEn = category.name?.en || '';
    const displayNameZh = category.name?.zh || '';
    const displayNameKo = category.name?.ko || '';
    
    // Create item with children for expandable rows
    const item: CategoryTableItem = {
      ...category,
      key,
      displayName,
      displayNameEn,
      displayNameZh,
      displayNameKo,
      level,
      parentName: parentName || undefined,
      parentId: parentId || null,
      children: category.children && category.children.length > 0
        ? convertCategoriesToTableItems(category.children, locale, level + 1, displayName, category._id)
        : undefined,
    };
    
    return item;
  });
};


const CategoryManagement: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>(null);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryTableItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<API.Category | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [editModalType, setEditModalType] = useState<'full' | 'image' | 'name' | 'status' | 'recommend' | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [form] = Form.useForm();
  const [imageForm] = Form.useForm();
  const [nameForm] = Form.useForm();
  const [statusForm] = Form.useForm();
  
  const { platform, status, setPlatform, setStatus } = useCategoryStore();

  // Fetch categories using useQuery
  const { data: categoryData, isLoading, refetch } = useQuery({
    queryKey: ['categories', platform, status, searchName],
    queryFn: async () => {
      console.log('📥 Fetch Categories - Request:', {
        platform,
        status,
        name: searchName || undefined,
        url: '/api/v1/admin/categories/tree',
        method: 'GET',
      });
      const response = await getCategoryTree({
        platform,
        status,
        name: searchName || undefined,
      });
      console.log('📥 Fetch Categories - Response:', {
        status: response.status,
        statusCode: response.statusCode,
        message: response.message,
        totalCategories: response.data?.totalCategories,
        treeLength: response.data?.tree?.length,
        platform: response.data?.platform,
        timestamp: response.timestamp,
      });
      return response;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const categories = categoryData?.data?.tree || [];
  const totalCategories = categoryData?.data?.totalCategories || 0;
  const currentLocale = intl.locale || 'ko-KR';
  
  // Debug log for locale
  console.log('🌐 Current Locale:', {
    locale: currentLocale,
    intlLocale: intl.locale,
    expectedKorean: currentLocale === 'ko-KR',
  });

  // Convert categories to table items with hierarchical structure for expandable rows
  const tableCategories = useMemo(() => {
    return convertCategoriesToTableItems(categories, currentLocale);
  }, [categories, currentLocale]);

  // Handlers for separate field updates
  const handleImageClick = (category: API.Category) => {
    setEditingCategory(category);
    setEditModalType('image');
    imageForm.setFieldsValue({ imageUrl: category.imageUrl || '' });
  };

  const handleNameClick = (category: API.Category) => {
    setEditingCategory(category);
    setEditModalType('name');
    nameForm.setFieldsValue({
      nameKo: category.name?.ko || '',
      nameEn: category.name?.en || '',
      nameZh: category.name?.zh || '',
    });
  };

  const handleStatusClick = (category: API.Category) => {
    setEditingCategory(category);
    setEditModalType('status');
    const categoryLevel = (category as any).level;
    const formValues: any = {
      isActive: category.isActive ?? true,
    };
    // Only set isDefault for level 1 (level === 0)
    if (categoryLevel === 0) {
      formValues.isDefault = (category as any).isDefault ?? false;
    }
    statusForm.setFieldsValue(formValues);
  };

  const handleRecommendClick = (category: API.Category) => {
    setEditingCategory(category);
    setEditModalType('recommend');
    statusForm.setFieldsValue({ isDefault: (category as any).isDefault ?? false });
  };


  // Helper function to handle API errors
  const handleApiError = (error: any) => {
    const errorData = error?.response?.data || error;
    const errorCode = errorData?.errorCode;
    const errorMessage = errorData?.message;
    
    console.error('❌ API Error:', {
      errorCode,
      errorMessage,
      statusCode: errorData?.statusCode,
      fullError: errorData,
    });
    
    let messageKey = 'pages.products.category.updateFailed';
    if (errorCode === 'VALIDATION_ERROR') {
      messageKey = 'pages.products.category.validationError';
    } else if (errorCode === 'CATEGORY_NOT_FOUND') {
      messageKey = 'pages.products.category.categoryNotFound';
    } else if (errorCode === 'UNAUTHORIZED') {
      messageKey = 'pages.products.category.unauthorized';
    }
    
    message.error(errorMessage || intl.formatMessage({ id: messageKey }));
  };

  // Update category mutation (full update)
  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; data: any }) => {
      console.log('🔄 Update Category - Request:', {
        id: params.id,
        data: params.data,
        url: `/api/v1/admin/categories/${params.id}`,
        method: 'PUT',
      });
      const response = await updateCategory(params.id, params.data);
      console.log('✅ Update Category - Response:', {
        status: response.status,
        statusCode: response.statusCode,
        message: response.message,
        errorCode: response.errorCode,
        data: response.data,
        timestamp: response.timestamp,
      });
      return response;
    },
    onSuccess: (data) => {
      console.log('✅ Update Category - Success Handler:', data);
      if (data.status === 'success') {
        message.success(data.message || intl.formatMessage({ id: 'pages.products.category.updateSuccess' }));
        queryClient.invalidateQueries({ queryKey: ['categories', platform, status, searchName] });
        setModalVisible(false);
        setEditModalType(null);
        setEditingItem(null);
        setEditingCategory(null);
        form.resetFields();
        statusForm.resetFields();
      } else {
        handleApiError({ response: { data } });
      }
    },
    onError: handleApiError,
  });

  // Update category status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (params: { id: string; isActive: boolean }) => {
      console.log('🔄 Update Category Status - Request:', {
        id: params.id,
        isActive: params.isActive,
      });
      const response = await updateCategoryStatus(params.id, params.isActive);
      console.log('✅ Update Category Status - Response:', response);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        message.success(data.message || intl.formatMessage({ id: 'pages.products.category.updateSuccess' }));
        queryClient.invalidateQueries({ queryKey: ['categories', platform, status, searchName] });
      } else {
        handleApiError({ response: { data } });
      }
    },
    onError: handleApiError,
  });

  // Update category image mutation
  const updateImageMutation = useMutation({
    mutationFn: async (params: { id: string; imageUrl: string | null }) => {
      console.log('🔄 Update Category Image - Request:', {
        id: params.id,
        imageUrl: params.imageUrl,
      });
      const response = await updateCategoryImage(params.id, params.imageUrl);
      console.log('✅ Update Category Image - Response:', response);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        message.success(data.message || intl.formatMessage({ id: 'pages.products.category.updateSuccess' }));
        queryClient.invalidateQueries({ queryKey: ['categories', platform, status, searchName] });
        setModalVisible(false);
        setEditModalType(null);
        setEditingItem(null);
        setEditingCategory(null);
        imageForm.resetFields();
      } else {
        handleApiError({ response: { data } });
      }
    },
    onError: handleApiError,
  });

  // Update category name mutation
  const updateNameMutation = useMutation({
    mutationFn: async (params: { id: string; name: { zh?: string; en?: string; ko?: string } }) => {
      console.log('🔄 Update Category Name - Request:', {
        id: params.id,
        name: params.name,
      });
      const response = await updateCategoryName(params.id, params.name);
      console.log('✅ Update Category Name - Response:', response);
      return response;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        message.success(data.message || intl.formatMessage({ id: 'pages.products.category.updateSuccess' }));
        queryClient.invalidateQueries({ queryKey: ['categories', platform, status, searchName] });
        setModalVisible(false);
        setEditModalType(null);
        setEditingItem(null);
        setEditingCategory(null);
        nameForm.resetFields();
      } else {
        handleApiError({ response: { data } });
      }
    },
    onError: handleApiError,
  });

  // Reload table when data changes
  useEffect(() => {
    if (!isLoading) {
      actionRef.current?.reload();
    }
  }, [tableCategories, isLoading]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Find category by ID in the tree
  const findCategoryById = (categories: API.Category[], id: string): API.Category | null => {
    for (const category of categories) {
      if (category._id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleEdit = (record?: CategoryTableItem | API.Category, type: 'full' | 'image' | 'name' | 'status' | 'recommend' = 'full') => {
    console.log('📝 Handle Edit - Called:', {
      hasRecord: !!record,
      record,
      type,
    });
    
    if (!record) {
      console.error('❌ Handle Edit - No record provided');
      message.error(intl.formatMessage({ id: 'pages.products.category.categoryNotFound' }));
      return;
    }
    
    // Set editing item/category based on type
    if (record && '_id' in record && 'displayName' in record) {
      setEditingItem(record as CategoryTableItem);
    } else {
      setEditingCategory(record as API.Category);
    }
    
    setEditModalType(type);
    
    // Set form values based on edit type
    if (type === 'full') {
      const recordLevel = (record as any).level;
      const formValues: any = {
        nameKo: record.name?.ko || (record as any).displayNameKo || '',
        nameEn: record.name?.en || (record as any).displayNameEn || '',
        nameZh: record.name?.zh || (record as any).displayNameZh || '',
        imageUrl: record.imageUrl || '',
        isActive: record.isActive ?? true,
      };
      // Only set isDefault for level 1 (level === 0)
      if (recordLevel === 0) {
        formValues.isDefault = (record as any).isDefault ?? false;
      }
      form.setFieldsValue(formValues);
    } else if (type === 'image') {
      imageForm.setFieldsValue({ imageUrl: record.imageUrl || '' });
    } else if (type === 'name') {
      nameForm.setFieldsValue({
        nameKo: record.name?.ko || '',
        nameEn: record.name?.en || '',
        nameZh: record.name?.zh || '',
      });
    } else if (type === 'status') {
      const recordLevel = (record as any).level;
      const formValues: any = {
        isActive: record.isActive ?? true,
      };
      // Only set isDefault for level 1 (level === 0)
      if (recordLevel === 0) {
        formValues.isDefault = (record as any).isDefault ?? false;
      }
      statusForm.setFieldsValue(formValues);
    } else if (type === 'recommend') {
      statusForm.setFieldsValue({ isDefault: (record as any).isDefault ?? false });
    }
    
    setModalVisible(true);
  };

  const handleDelete = (record: CategoryTableItem) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'pages.products.category.deleteConfirm' }),
      content: intl.formatMessage(
        { id: 'pages.products.category.deleteContent' },
        {
          name: record.displayName,
          count: '',
        },
      ),
      onOk: () => {
        message.success(intl.formatMessage({ id: 'pages.products.category.deleteSuccess' }));
        refetch();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const categoryId = (editingItem as any)?._id || editingCategory?._id;
      
      if (!categoryId) {
        console.error('❌ Handle Submit - No category ID found');
        message.error(intl.formatMessage({ id: 'pages.products.category.categoryNotFound' }));
        return;
      }

      if (editModalType === 'image') {
        const values = await imageForm.validateFields();
        console.log('📤 Handle Submit - Updating image:', { categoryId, imageUrl: values.imageUrl });
        updateImageMutation.mutate({ id: categoryId, imageUrl: values.imageUrl || null });
      } else if (editModalType === 'name') {
        const values = await nameForm.validateFields();
        console.log('📤 Handle Submit - Updating name:', { categoryId, name: values });
        // Ensure Korean name is always included (required field, but ensure it's never undefined)
        const updateName = {
          ko: values.nameKo ?? '',
          en: values.nameEn ?? '',
          zh: values.nameZh ?? '',
        };
        // Verify Korean is included
        if (!updateName.ko && updateName.ko !== '') {
          console.warn('⚠️ Korean name is missing, using empty string');
        }
        console.log('📤 Handle Submit - Name update payload (ensuring Korean is included):', updateName);
        updateNameMutation.mutate({
          id: categoryId,
          name: updateName,
        });
      } else if (editModalType === 'status') {
        const values = await statusForm.validateFields();
        const categoryLevel = editingCategory?.level ?? editingItem?.level;
        console.log('📤 Handle Submit - Updating status and recommend:', { 
          categoryId, 
          isActive: values.isActive,
          isDefault: values.isDefault,
          level: categoryLevel,
        });
        // Update both status and recommend in the full update mutation
        // Only include isDefault for level 1 (level === 0)
        const updateData: any = {
          isActive: values.isActive ?? true,
        };
        if (categoryLevel === 0) {
          updateData.isDefault = values.isDefault ?? false;
        }
        updateMutation.mutate({ 
          id: categoryId, 
          data: updateData,
        });
      } else if (editModalType === 'recommend') {
        const values = await statusForm.validateFields();
        console.log('📤 Handle Submit - Updating recommend:', { categoryId, isDefault: values.isDefault });
        // Update status.Recommended using the full update mutation
        updateMutation.mutate({ 
          id: categoryId, 
          data: {
            status: {
              Recommended: values.isDefault ?? false,
            },
          },
        });
      } else {
        // Full edit
        const values = await form.validateFields();
        const categoryLevel = editingCategory?.level ?? editingItem?.level;
        console.log('📤 Handle Submit - Full update:', { categoryId, values, level: categoryLevel });
        // Ensure Korean name is always included
        // Only include isDefault for level 1 (level === 0)
        const updateData: any = {
          isActive: values.isActive ?? true,
          imageUrl: values.imageUrl || null,
          name: {
            ko: values.nameKo ?? '',
            en: values.nameEn ?? '',
            zh: values.nameZh ?? '',
          },
        };
        if (categoryLevel === 0) {
          updateData.isDefault = values.isDefault ?? false;
        }
        // Verify Korean is included
        if (!updateData.name.ko && updateData.name.ko !== '') {
          console.warn('⚠️ Korean name is missing in full update, using empty string');
        }
        console.log('📤 Handle Submit - Full update payload (ensuring Korean is included):', updateData);
        updateMutation.mutate({ id: categoryId, data: updateData });
      }
    } catch (error) {
      console.error('❌ Handle Submit - Validation failed:', error);
    }
  };

  const handleOrderChange = (
    record: CategoryTableItem,
    direction: 'up' | 'down',
  ) => {
    message.success(
      intl.formatMessage(
        { id: 'pages.products.category.orderMoved' },
        {
          name: record.displayName,
          direction: direction === 'up' ? intl.formatMessage({ id: 'pages.products.category.orderUp' }) : intl.formatMessage({ id: 'pages.products.category.orderDown' }),
        },
      ),
    );
    refetch();
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => {
    setStatus(value);
  };

  // Create columns with reactive i18n
  const columns: ProColumns<CategoryTableItem>[] = useMemo(() => [
    // Filter columns (hidden in table)
    {
      title: intl.formatMessage({ id: 'pages.products.category.platform' }),
      dataIndex: 'platform',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        '1688': '1688',
        'taobao': intl.formatMessage({ id: 'pages.products.category.platformTaobao' }),
        'vip': intl.formatMessage({ id: 'pages.products.category.platformVip' }),
        'mycompany': intl.formatMessage({ id: 'pages.products.category.platformMyCompany' }),
      },
      fieldProps: {
        defaultValue: platform,
      },
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            {...rest}
            value={platform}
            onChange={(value: string) => {
              handlePlatformChange(value);
              setTimeout(() => {
                actionRef.current?.reload();
              }, 100);
            }}
          >
            <Option value="1688">1688</Option>
            <Option value="taobao">{intl.formatMessage({ id: 'pages.products.category.platformTaobao' })}</Option>
            <Option value="vip">{intl.formatMessage({ id: 'pages.products.category.platformVip' })}</Option>
            <Option value="mycompany">{intl.formatMessage({ id: 'pages.products.category.platformMyCompany' })}</Option>
          </Select>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.status' }),
      dataIndex: 'status',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        'all': intl.formatMessage({ id: 'pages.products.category.statusAll' }),
        'active': intl.formatMessage({ id: 'pages.products.category.active' }),
        'inactive': intl.formatMessage({ id: 'pages.products.category.inactive' }),
      },
      fieldProps: {
        defaultValue: status,
      },
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return (
          <Select
            {...rest}
            value={status}
            onChange={(value: 'all' | 'active' | 'inactive') => {
              handleStatusChange(value);
              setTimeout(() => {
                actionRef.current?.reload();
              }, 100);
            }}
          >
            <Option value="all">{intl.formatMessage({ id: 'pages.products.category.statusAll' })}</Option>
            <Option value="active">{intl.formatMessage({ id: 'pages.products.category.active' })}</Option>
            <Option value="inactive">{intl.formatMessage({ id: 'pages.products.category.inactive' })}</Option>
          </Select>
        );
      },
    },
    // Table columns
    {
      title: intl.formatMessage({ id: 'pages.products.category.image' }),
      dataIndex: 'imageUrl',
      width: 180,
      hideInSearch: true,
      render: (_, record) => {
        const handleImageClick = (e?: React.MouseEvent) => {
          if (e) {
            e.stopPropagation();
          }
          handleEdit(record as any, 'image');
        };
        
        const imageUrl = record.imageUrl;
        const hasValidImageUrl = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '';
        
        if (hasValidImageUrl) {
          const handleEditClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            handleEdit(record as any, 'image');
          };

          const handlePreviewClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            // Find the image element in the parent container and trigger preview
            const container = e.currentTarget.closest('div[style*="position: relative"]');
            const imageWrapper = container?.querySelector('.ant-image');
            const imgElement = imageWrapper?.querySelector('img') as HTMLElement;
            if (imgElement) {
              imgElement.click();
            }
          };

          // Use the image URL directly - no proxy needed
          // The browser will handle CORS automatically
          const imageSrc = imageUrl;

          return (
            <div
              style={{ 
                position: 'relative',
                width: 80,
                height: 80,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: '#fafafa',
              }}
            >
              <Image
                src={imageSrc}
                width={80}
                height={80}
                style={{ 
                  objectFit: 'cover', 
                  borderRadius: 4, 
                  flexShrink: 0,
                  display: 'block',
                }}
                preview={{
                  src: imageUrl,
                  mask: (
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                      <EyeOutlined style={{ fontSize: 16, color: '#fff' }} />
                    </div>
                  ),
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  pointerEvents: 'none',
                }}
                className="image-overlay"
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.pointerEvents = 'auto';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                  e.currentTarget.style.pointerEvents = 'none';
                }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined style={{ color: '#fff', fontSize: 14 }} />}
                  style={{ 
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    minWidth: 32,
                    height: 32,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                  }}
                  onClick={handlePreviewClick}
                  title="Preview"
                />
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined style={{ color: '#fff', fontSize: 14 }} />}
                  style={{ 
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    minWidth: 32,
                    height: 32,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                  }}
                  onClick={handleEditClick}
                  title={intl.formatMessage({ id: 'pages.products.category.clickToEdit' })}
                />
              </div>
            </div>
          );
        }
        return (
          <div
            onClick={handleImageClick}
            style={{ 
              cursor: 'pointer', 
              color: '#d9d9d9',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed #d9d9d9',
              borderRadius: 4,
            }}
            title={intl.formatMessage({ id: 'pages.products.category.clickToEdit' })}
          >
            <PictureOutlined style={{ fontSize: 32 }} />
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.name' }),
      dataIndex: 'name',
      width: 300,
      valueType: 'text',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'pages.products.category.searchNamePlaceholder' }),
      },
      render: (_text, record) => {
        const handleNameClick = () => {
          handleEdit(record as any, 'name');
        };
        
        // Get names based on current locale priority
        const currentLocale = intl.locale || 'ko-KR';
        let primaryName = '';
        let secondaryName = '';
        let tertiaryName = '';
        
        if (currentLocale === 'ko-KR') {
          // Korean: Show Korean, English, Chinese
          primaryName = record.displayNameKo || record.displayName || '';
          secondaryName = record.displayNameEn || '';
          tertiaryName = record.displayNameZh || '';
        } else if (currentLocale === 'en-US') {
          // English: Show English, Korean, Chinese
          primaryName = record.displayNameEn || record.displayName || '';
          secondaryName = record.displayNameKo || '';
          tertiaryName = record.displayNameZh || '';
        } else if (currentLocale === 'zh-CN') {
          // Chinese: Show Chinese, English, Korean
          primaryName = record.displayNameZh || record.displayName || '';
          secondaryName = record.displayNameEn || '';
          tertiaryName = record.displayNameKo || '';
        } else {
          primaryName = record.displayName || '';
          secondaryName = record.displayNameEn || '';
          tertiaryName = record.displayNameZh || '';
        }
        
        return (
          <div
            onClick={handleNameClick}
            style={{ cursor: 'pointer', width: '100%' }}
            title={intl.formatMessage({ id: 'pages.products.category.clickToEdit' })}
          >
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space>
                {record.level === 0 ? (
                  <ApartmentOutlined style={{ color: '#1890ff', fontSize: 16 }} />
                ) : record.level === 1 ? (
                  <BarsOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                ) : (
                  <NodeIndexOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                )}
                <strong>{primaryName || '-'}</strong>
                {record.level === 0 && <Tag color="blue">{intl.formatMessage({ id: 'pages.products.category.level1' })}</Tag>}
                {record.level === 1 && <Tag color="green">{intl.formatMessage({ id: 'pages.products.category.level2' })}</Tag>}
                {record.level === 2 && <Tag color="orange">{intl.formatMessage({ id: 'pages.products.category.level3' })}</Tag>}
              </Space>
              {secondaryName && (
                <div style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
                  {secondaryName}
                </div>
              )}
              {tertiaryName && (
                <div style={{ fontSize: 12, color: '#999', paddingLeft: 20 }}>
                  {tertiaryName}
                </div>
              )}
            </Space>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.parent' }),
      dataIndex: 'parentName',
      width: 200,
      hideInSearch: true,
      render: (_text, record) => {
        if (record.level === 0) {
          return <Tag>{intl.formatMessage({ id: 'pages.products.category.topLevel' })}</Tag>;
        }
        return record.parentName ? (
          <span>{record.parentName}</span>
        ) : (
          <span style={{ color: '#d9d9d9' }}>-</span>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.externalId' }),
      dataIndex: 'externalId',
      width: 120,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.level' }),
      dataIndex: 'level',
      width: 80,
      hideInSearch: true,
      valueEnum: {
        0: { text: intl.formatMessage({ id: 'pages.products.category.level1' }), status: 'Processing' },
        1: { text: intl.formatMessage({ id: 'pages.products.category.level2' }), status: 'Success' },
        2: { text: intl.formatMessage({ id: 'pages.products.category.level3' }), status: 'Warning' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.statusRecommend' }),
      dataIndex: 'isActive',
      hideInSearch: true, // Hide status filter in search/filter section
      width: 150,
      valueType: 'select',
      valueEnum: {
        true: { text: intl.formatMessage({ id: 'pages.products.category.active' }), status: 'Success' },
        false: { text: intl.formatMessage({ id: 'pages.products.category.inactive' }), status: 'Default' },
      },
      render: (_, record) => {
        const handleStatusClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          handleEdit(record as any, 'status');
        };
        
        const handleRecommendFieldClick = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (record.level === 0) {
            handleEdit(record as any, 'recommend');
          }
          // handleRecommendClick(record as any);
        };
        
        const isRecommended = (record as any).isDefault ?? false;
        
        return (
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <div
              onClick={handleStatusClick}
              style={{ cursor: 'pointer', width: '100%', padding: '4px 0' }}
              title={intl.formatMessage({ id: 'pages.products.category.clickToEdit' })}
            >
              <Tag color={record.isActive ? 'success' : 'default'}>
                {record.isActive
                  ? intl.formatMessage({ id: 'pages.products.category.active' })
                  : intl.formatMessage({ id: 'pages.products.category.inactive' })}
              </Tag>
            </div>
            <div 
              onClick={handleRecommendFieldClick}
              style={{ cursor: 'pointer', width: '100%', padding: '4px 0', fontSize: 12 }}
              title={intl.formatMessage({ id: 'pages.products.category.clickToEdit' })}
            >
              <Tag color={isRecommended ? 'gold' : 'default'}>
                {isRecommended
                  ? intl.formatMessage({ id: 'pages.products.category.recommended' })
                  : intl.formatMessage({ id: 'pages.products.category.notRecommended' })}
              </Tag>
            </div>
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.createdAt' }),
      dataIndex: 'createdAt',
      width: 180,
      hideInSearch: true,
      render: (_, record) => (
        <div style={{ fontSize: 12 }}>
          {record.createdAt ? new Date(record.createdAt).toLocaleString() : '-'}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.products.category.actions' }),
      width: 220,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={() => handleOrderChange(record, 'up')}
            disabled={record.level === 0}
          />
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={() => handleOrderChange(record, 'down')}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record as any)}
          >
            {intl.formatMessage({ id: 'pages.products.category.edit' })}
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => handleDelete(record)}
          >
            {intl.formatMessage({ id: 'pages.products.category.delete' })}
          </Button>
        </Space>
      ),
    },
  ], [intl, platform, status, currentLocale, handleEdit, handleOrderChange, handleDelete, handlePlatformChange, handleStatusChange, tableCategories]);

  return (
    <PageContainer>
      <ProTable<CategoryTableItem>
        headerTitle={intl.formatMessage({ id: 'pages.products.category.title' })}
        actionRef={actionRef}
        rowKey="key"
        loading={isLoading}
        toolBarRender={() => [
          <span key="total" style={{ marginRight: 16, color: '#666' }}>
            {intl.formatMessage({ id: 'pages.products.category.totalCategories' })}: {totalCategories}
          </span>,
          ...(platform === 'mycompany' ? [
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              {intl.formatMessage({ id: 'pages.products.category.add' })}
            </Button>
          ] : []),
        ]}
        request={async (params) => {
          // Get name from search params
          const searchNameParam = params.name || '';
          if (searchNameParam !== searchName) {
            setSearchName(searchNameParam);
          }
          
          return {
            data: tableCategories,
            success: true,
            total: tableCategories.length,
          };
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        columns={columns}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: (keys) => {
            setExpandedRowKeys(keys as React.Key[]);
          },
          // Only show expand button for categories (level 0) and subcategories (level 1) that have children
          rowExpandable: (record) => {
            return !!(record.children && record.children.length > 0);
          },
        }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
      />

      {/* Full Edit Modal */}
      <Modal
        title={editingItem || editingCategory ? intl.formatMessage({ id: 'pages.products.category.editTitle' }) : intl.formatMessage({ id: 'pages.products.category.addTitle' })}
        open={modalVisible && (editModalType === 'full' || editModalType === null)}
        onCancel={() => {
          setModalVisible(false);
          setEditModalType(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        width={700}
      >
        <Form form={form} layout="vertical">
          {!editingItem && !editingCategory && (
            <>
              <Form.Item
                name="level"
                label={intl.formatMessage({ id: 'pages.products.category.level' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'pages.products.category.levelRequired' }) }]}
              >
                <Select
                  placeholder={intl.formatMessage({ id: 'pages.products.category.levelPlaceholder' })}
                  onChange={(value) => {
                    // Reset parentId when level changes
                    form.setFieldsValue({ parentId: undefined });
                  }}
                >
                  <Option value={0}>{intl.formatMessage({ id: 'pages.products.category.level1' })}</Option>
                  <Option value={1}>{intl.formatMessage({ id: 'pages.products.category.level2' })}</Option>
                  <Option value={2}>{intl.formatMessage({ id: 'pages.products.category.level3' })}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.level !== currentValues.level}
              >
                {({ getFieldValue }) => {
                  const level = getFieldValue('level');
                  if (level === undefined || level === 0) {
                    return null;
                  }
                  
                  // Helper function to flatten categories for parent selection
                  const flattenForParentSelection = (cats: CategoryTableItem[]): CategoryTableItem[] => {
                    const result: CategoryTableItem[] = [];
                    cats.forEach((cat) => {
                      result.push(cat);
                      if (cat.children && cat.children.length > 0) {
                        result.push(...flattenForParentSelection(cat.children));
                      }
                    });
                    return result;
                  };
                  
                  // Get available parent categories based on level
                  const allCategories = flattenForParentSelection(tableCategories);
                  const availableParents = allCategories.filter((cat: CategoryTableItem) => {
                    if (level === 1) {
                      return cat.level === 0; // Subcategory needs level 0 parent
                    } else if (level === 2) {
                      return cat.level === 1; // Subsubcategory needs level 1 parent
                    }
                    return false;
                  });
                  
                  return (
                    <Form.Item
                      name="parentId"
                      label={intl.formatMessage({ id: 'pages.products.category.parent' })}
                      rules={[{ required: true, message: intl.formatMessage({ id: 'pages.products.category.parentRequired' }) }]}
                    >
                      <Select
                        placeholder={intl.formatMessage({ id: 'pages.products.category.parentPlaceholder' })}
                        showSearch
                        filterOption={(input, option) => {
                          const label = String(option?.label || option?.children || '');
                          return label.toLowerCase().includes(input.toLowerCase());
                        }}
                      >
                        {availableParents.map((cat) => {
                          const catId = (cat as any)._id || cat.key || '';
                          return (
                            <Option key={catId} value={catId}>
                              {cat.displayName}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </>
          )}
          <Form.Item
            name="nameKo"
            label={intl.formatMessage({ id: 'pages.products.category.nameKo' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.products.category.nameKoRequired' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameKoPlaceholder' })} />
          </Form.Item>
          <Form.Item
            name="nameEn"
            label={intl.formatMessage({ id: 'pages.products.category.nameEnLabel' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameEnPlaceholder' })} />
          </Form.Item>
          <Form.Item
            name="nameZh"
            label={intl.formatMessage({ id: 'pages.products.category.nameCnLabel' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameCnPlaceholder' })} />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label={intl.formatMessage({ id: 'pages.products.category.imageUrl' })}
          >
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.imageUrl !== currentValues.imageUrl}>
              {({ getFieldValue }) => {
                const imageUrl = getFieldValue('imageUrl');
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', width: '100%' }}>
                    <Space.Compact style={{ flex: '0 1 auto', minWidth: 0 }}>
                      <Form.Item name="imageUrl" noStyle>
                        <Input
                          placeholder={intl.formatMessage({ id: 'pages.products.category.imageUrlPlaceholder' })}
                        />
                      </Form.Item>
                      <Upload
                        name="file"
                        action="/api/v1/admin/upload/cloudinary"
                        headers={{
                          authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        }}
                        showUploadList={false}
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error(intl.formatMessage({ id: 'pages.products.category.uploadImageOnly' }));
                            return false;
                          }
                          const isLt10M = file.size / 1024 / 1024 < 10;
                          if (!isLt10M) {
                            message.error(intl.formatMessage({ id: 'pages.products.category.imageSizeLimit' }));
                            return false;
                          }
                          return true;
                        }}
                        onChange={(info) => {
                          console.log('📤 Upload onChange:', {
                            status: info.file.status,
                            name: info.file.name,
                            response: info.file.response,
                            error: info.file.error,
                          });
                          
                          if (info.file.status === 'uploading') {
                            setImageUploading(true);
                          } else if (info.file.status === 'done') {
                            setImageUploading(false);
                            console.log('✅ Upload successful, response:', info.file.response);
                            // Try multiple response formats
                            const imageUrl = info.file.response?.url || 
                                             info.file.response?.data?.url || 
                                             info.file.response?.secure_url ||
                                             info.file.response?.data?.secure_url ||
                                             info.file.response?.data?.imageUrl ||
                                             info.file.response?.imageUrl;
                            if (imageUrl) {
                              form.setFieldsValue({ imageUrl });
                              message.success(intl.formatMessage({ id: 'pages.products.category.uploadSuccess' }));
                            } else {
                              console.error('❌ Upload response missing URL. Full response:', JSON.stringify(info.file.response, null, 2));
                              message.error(`${intl.formatMessage({ id: 'pages.products.category.uploadFailed' })}: ${info.file.response?.message || 'Invalid response format'}`);
                            }
                          } else if (info.file.status === 'error') {
                            setImageUploading(false);
                            const errorMsg = info.file.error?.message || 
                                            info.file.response?.message || 
                                            info.file.response?.error ||
                                            'Unknown error';
                            console.error('❌ Upload error:', {
                              error: info.file.error,
                              response: info.file.response,
                              status: info.file.response?.status,
                              statusText: info.file.response?.statusText,
                            });
                            message.error(`${intl.formatMessage({ id: 'pages.products.category.uploadFailed' })}: ${errorMsg}`);
                          }
                        }}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          loading={imageUploading}
                          style={{ width: 100 }}
                        >
                          {intl.formatMessage({ id: 'pages.products.category.upload' })}
                        </Button>
                      </Upload>
                    </Space.Compact>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9', flexShrink: 0 }}
                        preview={{
                          src: imageUrl,
                          mask: (
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                              <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ color: '#fff', padding: '2px 4px', minWidth: 'auto', height: 'auto' }}
                              />
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                style={{ color: '#fff', padding: '2px 4px', minWidth: 'auto', height: 'auto' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </div>
                          ),
                        }}
                      />
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>
          <Form.Item 
            name="isActive" 
            label={intl.formatMessage({ id: 'pages.products.category.statusLabel' })} 
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={intl.formatMessage({ id: 'pages.products.category.active' })} 
              unCheckedChildren={intl.formatMessage({ id: 'pages.products.category.inactive' })} 
            />
          </Form.Item>
          {((editingItem && editingItem.level === 0) || (editingCategory && editingCategory.level === 0)) && (
            <Form.Item 
              name="isDefault" 
              label={intl.formatMessage({ id: 'pages.products.category.recommended' })}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={intl.formatMessage({ id: 'pages.products.category.recommended' })} 
                unCheckedChildren={intl.formatMessage({ id: 'pages.products.category.notRecommended' })} 
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Image Edit Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.products.category.editImage' })}
        open={modalVisible && editModalType === 'image'}
        onCancel={() => {
          setModalVisible(false);
          setEditModalType(null);
          imageForm.resetFields();
        }}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={imageForm} layout="vertical">
          <Form.Item
            name="imageUrl"
            label={intl.formatMessage({ id: 'pages.products.category.imageUrl' })}
          >
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.imageUrl !== currentValues.imageUrl}>
              {({ getFieldValue }) => {
                const imageUrl = getFieldValue('imageUrl');
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', width: '100%' }}>
                    <Space.Compact style={{ flex: '0 1 auto', minWidth: 0 }}>
                      <Form.Item name="imageUrl" noStyle>
                        <Input
                          placeholder={intl.formatMessage({ id: 'pages.products.category.imageUrlPlaceholder' })}
                        />
                      </Form.Item>
                      <Upload
                        name="file"
                        action="/api/v1/admin/upload/cloudinary"
                        headers={{
                          authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                        }}
                        showUploadList={false}
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error(intl.formatMessage({ id: 'pages.products.category.uploadImageOnly' }));
                            return false;
                          }
                          const isLt10M = file.size / 1024 / 1024 < 10;
                          if (!isLt10M) {
                            message.error(intl.formatMessage({ id: 'pages.products.category.imageSizeLimit' }));
                            return false;
                          }
                          return true;
                        }}
                        onChange={(info) => {
                          if (info.file.status === 'uploading') {
                            setImageUploading(true);
                          } else if (info.file.status === 'done') {
                            setImageUploading(false);
                            // Assuming the API returns { url: '...' } or { data: { url: '...' } } or { secure_url: '...' }
                            const imageUrl = info.file.response?.url || 
                                             info.file.response?.data?.url || 
                                             info.file.response?.secure_url ||
                                             info.file.response?.data?.secure_url;
                            if (imageUrl) {
                              imageForm.setFieldsValue({ imageUrl });
                              message.success(intl.formatMessage({ id: 'pages.products.category.uploadSuccess' }));
                            } else {
                              console.error('Upload response:', info.file.response);
                              message.error(intl.formatMessage({ id: 'pages.products.category.uploadFailed' }));
                            }
                          } else if (info.file.status === 'error') {
                            setImageUploading(false);
                            message.error(intl.formatMessage({ id: 'pages.products.category.uploadFailed' }));
                          }
                        }}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          loading={imageUploading}
                          style={{ width: 100 }}
                        >
                          {intl.formatMessage({ id: 'pages.products.category.upload' })}
                        </Button>
                      </Upload>
                    </Space.Compact>
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9', flexShrink: 0 }}
                        preview={{
                          src: imageUrl,
                          mask: (
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                              <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ color: '#fff', padding: '2px 4px', minWidth: 'auto', height: 'auto' }}
                              />
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                style={{ color: '#fff', padding: '2px 4px', minWidth: 'auto', height: 'auto' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </div>
                          ),
                        }}
                      />
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      {/* Name Edit Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.products.category.editName' })}
        open={modalVisible && editModalType === 'name'}
        onCancel={() => {
          setModalVisible(false);
          setEditModalType(null);
          nameForm.resetFields();
        }}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={nameForm} layout="vertical">
          <Form.Item
            name="nameKo"
            label={intl.formatMessage({ id: 'pages.products.category.nameKo' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.products.category.nameKoRequired' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameKoPlaceholder' })} />
          </Form.Item>
          <Form.Item
            name="nameEn"
            label={intl.formatMessage({ id: 'pages.products.category.nameEnLabel' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameEnPlaceholder' })} />
          </Form.Item>
          <Form.Item
            name="nameZh"
            label={intl.formatMessage({ id: 'pages.products.category.nameCnLabel' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.products.category.nameCnPlaceholder' })} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Status Edit Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.products.category.editStatus' })}
        open={modalVisible && editModalType === 'status'}
        onCancel={() => {
          setModalVisible(false);
          setEditModalType(null);
          statusForm.resetFields();
        }}
        onOk={handleSubmit}
        width={400}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item 
            name="isActive" 
            label={intl.formatMessage({ id: 'pages.products.category.statusLabel' })}
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={intl.formatMessage({ id: 'pages.products.category.active' })} 
              unCheckedChildren={intl.formatMessage({ id: 'pages.products.category.inactive' })} 
            />
          </Form.Item>
          {/* {((editingCategory && editingCategory.level === 0) || (editingItem && editingItem.level === 0)) && (
            <Form.Item 
              name="isDefault" 
              label={intl.formatMessage({ id: 'pages.products.category.recommended' })}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={intl.formatMessage({ id: 'pages.products.category.recommended' })} 
                unCheckedChildren={intl.formatMessage({ id: 'pages.products.category.notRecommended' })} 
              />
            </Form.Item>
          )} */}
        </Form>
      </Modal>

      {/* Recommend Edit Modal */}
      <Modal
        title={intl.formatMessage({ id: 'pages.products.category.editRecommend' })}
        open={modalVisible && editModalType === 'recommend'}
        onCancel={() => {
          setModalVisible(false);
          setEditModalType(null);
          statusForm.resetFields();
        }}
        onOk={handleSubmit}
        width={400}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item 
            name="isDefault" 
            label={intl.formatMessage({ id: 'pages.products.category.recommended' })}
            valuePropName="checked"
          >
            <Switch 
              checkedChildren={intl.formatMessage({ id: 'pages.products.category.recommended' })} 
              unCheckedChildren={intl.formatMessage({ id: 'pages.products.category.notRecommended' })} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default CategoryManagement;
