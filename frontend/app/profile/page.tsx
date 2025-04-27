// components/Profile.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateUser } from '@/lib/authSlice';
import { useForm, SubmitHandler } from 'react-hook-form';

interface RootState {
  auth: {
    user: {
      id: number;
      ho_ten: string;
      anh_dai_dien: string | null;
      email: string;
      so_dien_thoai: string | null;
      dia_chi: string | null;
      token: string | null;
    } | null;
  };
}

interface FormData {
  ho_ten: string;
  so_dien_thoai: string;
  dia_chi: string;
  anh_dai_dien?: FileList; // Ảnh đại diện có thể không được chọn
}

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.user?.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>();

  const [editMode, setEditMode] = useState(false);
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.token) {
        setErrorMessage('Bạn chưa đăng nhập.');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/user-info', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        dispatch(updateUser(data));
        setValue('ho_ten', data.ho_ten || '');
        setValue('so_dien_thoai', data.so_dien_thoai || '');
        setValue('dia_chi', data.dia_chi || '');
      } catch (error: any) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        setErrorMessage(error.message || 'Lỗi không xác định khi tải thông tin.');
      }
    };

    if (user?.token) {
      fetchUserInfo();
    }
  }, [user?.token, dispatch, setValue]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setUpdateSuccessMessage('');
    setErrorMessage('');
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user?.token) {
      setErrorMessage('Bạn chưa đăng nhập.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ho_ten', data.ho_ten);
      formData.append('so_dien_thoai', data.so_dien_thoai || '');
      formData.append('dia_chi', data.dia_chi || '');
      if (data.anh_dai_dien && data.anh_dai_dien[0]) {
        formData.append('anh_dai_dien', data.anh_dai_dien[0]);
      }

      const response = await fetch('http://localhost:3000/api/user-info', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      setUpdateSuccessMessage('Cập nhật thông tin thành công!');
      setErrorMessage('');
      setEditMode(false);

      const userInfoResponse = await fetch('http://localhost:3000/api/user-info', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (userInfoResponse.ok) {
        const userInfoData = await userInfoResponse.json();
        dispatch(updateUser(userInfoData));
      }

      setTimeout(() => {
        setUpdateSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật:', error);
      setErrorMessage(error.message || 'Đã xảy ra lỗi không xác định.');
    }
  };

  if (!isClient) return null;

  if (!user) return <div className="text-center mt-8 text-red-500">Bạn chưa đăng nhập.</div>;

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-xl max-w-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thông Tin Tài Khoản</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      {updateSuccessMessage && <div className="text-green-500 mb-4">{updateSuccessMessage}</div>}

      {!editMode ? (
        <div className="space-y-4">
          {user.anh_dai_dien && (
            <div className="mb-6 flex justify-center">
              <img
                src={`http://localhost:3000/uploads/avatars/${user.anh_dai_dien}`}
                alt="Ảnh đại diện"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-xl"
              />
            </div>
          )}
          <div>
            <strong className="text-lg font-semibold text-gray-700">Họ và tên:</strong>
            <p className="text-xl text-gray-800">{user.ho_ten}</p>
          </div>
          <div>
            <strong className="text-lg font-semibold text-gray-700">Email:</strong>
            <p className="text-xl text-gray-800">{user.email}</p>
          </div>
          {user.so_dien_thoai && (
            <div>
              <strong className="text-lg font-semibold text-gray-700">Số điện thoại:</strong>
              <p className="text-xl text-gray-800">{user.so_dien_thoai}</p>
            </div>
          )}
          {user.dia_chi && (
            <div>
              <strong className="text-lg font-semibold text-gray-700">Địa chỉ:</strong>
              <p className="text-xl text-gray-800">{user.dia_chi}</p>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={toggleEditMode}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg transition duration-300 transform hover:scale-105"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="space-y-6">
            <div>
              <label htmlFor="ho_ten" className="block text-lg font-medium text-gray-700">Họ và tên:</label>
              <input
                type="text"
                id="ho_ten"
                {...register('ho_ten', { required: 'Họ và tên là bắt buộc' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {errors.ho_ten && <p className="text-red-500 text-sm">{errors.ho_ten.message}</p>}
            </div>

            <div>
              <label htmlFor="so_dien_thoai" className="block text-lg font-medium text-gray-700">Số điện thoại:</label>
              <input
                type="text"
                id="so_dien_thoai"
                {...register('so_dien_thoai')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="dia_chi" className="block text-lg font-medium text-gray-700">Địa chỉ:</label>
              <input
                type="text"
                id="dia_chi"
                {...register('dia_chi')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="anh_dai_dien" className="block text-lg font-medium text-gray-700">Ảnh đại diện:</label>
              <input
                type="file"
                id="anh_dai_dien"
                {...register('anh_dai_dien')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-800 text-white font-bold rounded-lg transition duration-300"
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                type="button"
                onClick={toggleEditMode}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-lg transition duration-300"
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
