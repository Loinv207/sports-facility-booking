import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPendingFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Gọi API lấy danh sách sân PENDING
    const fetchPendingFields = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/fields/pending');
            setFields(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sân:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingFields();
    }, []);

    // 2. Gọi API Duyệt sân
    const handleApprove = async (id) => {
        if (window.confirm("Xác nhận duyệt sân này?")) {
            try {
                // Sử dụng đúng method PUT như trong ảnh Swagger của bạn
                await axios.put(`http://localhost:8080/api/admin/fields/${id}/approve`);
                alert("Đã duyệt thành công!");
                
                // Cập nhật lại UI: Xóa sân vừa duyệt khỏi danh sách hiển thị
                setFields(fields.filter(f => f.id !== id));
            } catch (error) {
                alert("Lỗi khi duyệt sân. Vui lòng kiểm tra lại Backend!");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-6xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Quản lý duyệt sân</h1>
            
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="text-sm text-gray-600 uppercase bg-gray-100">
                            <th className="px-6 py-3 text-left">Tên sân</th>
                            <th className="px-6 py-3 text-left">Loại thể thao</th>
                            <th className="px-6 py-3 text-left">Địa chỉ</th>
                            <th className="px-6 py-3 text-left">Giá (VND)</th>
                            <th className="px-6 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {fields.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-10 text-center text-gray-500">
                                    Hiện tại không có sân nào đang chờ duyệt.
                                </td>
                            </tr>
                        ) : (
                            fields.map((field) => (
                                <tr key={field.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{field.fieldName}</td>
                                    <td className="px-6 py-4">{field.sportsType}</td>
                                    <td className="px-6 py-4">{field.address}</td>
                                    <td className="px-6 py-4">{field.price}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleApprove(field.id)}
                                            className="px-4 py-2 font-bold text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
                                        >
                                            Duyệt sân
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPendingFields;