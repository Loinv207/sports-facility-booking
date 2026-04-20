import React, { Activity, useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import { CheckCircle, Clock, MapPin, Search } from 'lucide-react';

const AdminPendingFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const fetchPendingFields = async () => {
    try {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            console.error("Không tìm thấy Token, vui lòng đăng nhập lại!");
            return;
        }

        const response = await axios.get('http://localhost:8080/api/admin/fields/pending', {
            headers: {
                
                'Authorization': `Bearer ${token}` 
            }
        });

        setFields(response.data); 
        setLoading(false);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error.response);
        setLoading(false);
    }
};

    
    useEffect(() => {
        const loadData = async () => {
            await fetchPendingFields();
    };
    loadData();
}, []); 

    
    const handleApprove = async (id) => {
        if (window.confirm("Xác nhận duyệt sân này?")) {
            try {
                
                await axios.put(`http://localhost:8080/api/admin/fields/${id}/approve`);
                alert("Đã duyệt thành công!");
                
                
                setFields(fields.filter(f => f.id !== id));
            } catch (error) {
                console.error("Chi tiết lỗi duyệt sân:", error); 
                alert("Lỗi khi duyệt sân. Vui lòng kiểm tra lại Backend!");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar bên trái */}
            <AdminSidebar />

            {/* Nội dung chính bên phải */}
            <main className="flex-1 p-8">
                <div className="mx-auto max-w-7xl">
                    
                    {/* Header Section */}
                    <div className="p-6 mb-8 bg-white border shadow-sm rounded-xl border-slate-100">
                        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                                    <Clock className="text-orange-500" /> Duyệt sân chờ
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Có {fields.length} sân đang chờ bạn phê duyệt vào hệ thống.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-hidden bg-white border shadow-sm rounded-xl border-slate-100">
                        {loading ? (
                            <div className="py-20 text-center text-slate-500 animate-pulse">
                                Đang tải danh sách sân chờ duyệt...
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-left text-slate-700">Tên sân</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left text-slate-700">Loại thể thao</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left text-slate-700">Địa chỉ</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-left text-slate-700">Giá (VND)</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-right text-slate-700">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {fields.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search className="w-10 h-10 mb-2 opacity-20" />
                                                    <p>Hiện tại không có sân nào đang chờ duyệt.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        fields.map((field) => (
                                            <tr key={field.id} className="transition-colors hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-800">{field.fieldName}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="w-3 h-3 text-slate-400" />
                                                        <span className="text-sm text-slate-600">{field.sportsType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 max-w-[250px]">
                                                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span className="text-sm truncate text-slate-600">{field.address}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {new Intl.NumberFormat('vi-VN').format(field.price)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleApprove(field.id)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-white transition duration-200 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 shadow-blue-200 active:scale-95"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Duyệt sân
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPendingFields;