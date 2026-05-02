import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import { Activity, AlertTriangle, CheckCircle, Clock, MapPin, Search, X } from 'lucide-react';

const AdminPendingFields = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingField, setApprovingField] = useState(null);
    const [submittingApprove, setSubmittingApprove] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusTone, setStatusTone] = useState('success');

    
    const fetchPendingFields = async () => {
    try {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            console.error("Không tìm thấy Token, vui lòng đăng nhập lại!");
            return;
        }

        const response = await axios.get('/api/admin/fields/pending', {
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

    
    const handleApprove = async () => {
        if (!approvingField) {
            return;
        }

        try {
            setSubmittingApprove(true);
            setStatusMessage('');

            const token = localStorage.getItem('token'); 
            await axios.put(`/api/admin/fields/${approvingField.id}/approve`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            setFields((current) => current.filter((field) => field.id !== approvingField.id));
            setStatusTone('success');
            setStatusMessage(`Đã duyệt sân "${approvingField.fieldName}" thành công.`);
            setApprovingField(null);
        } catch (error) {
            console.error("Chi tiết lỗi duyệt sân:", error); 
            setStatusTone('error');
            setStatusMessage('Lỗi khi duyệt sân. Vui lòng kiểm tra lại backend hoặc thử lại sau.');
        } finally {
            setSubmittingApprove(false);
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

                    {statusMessage ? (
                        <div className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm shadow-sm ${
                            statusTone === 'success'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                : 'border-rose-200 bg-rose-50 text-rose-800'
                        }`}>
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{statusMessage}</span>
                        </div>
                    ) : null}

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
                                                        onClick={() => {
                                                            setApprovingField(field);
                                                            setStatusMessage('');
                                                        }}
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

            {approvingField ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Xác nhận duyệt sân</h3>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Sau khi duyệt, sân sẽ chuyển sang trạng thái <strong>ACTIVE</strong> và có thể hiển thị cho người dùng cuối.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => !submittingApprove && setApprovingField(null)}
                                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Đóng"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-5">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                                <p className="text-sm font-semibold text-slate-900">{approvingField.fieldName}</p>
                                <p className="mt-2 text-sm text-slate-600">{approvingField.sportsType}</p>
                                <p className="mt-1 text-sm text-slate-500">{approvingField.address}</p>
                                <p className="mt-3 text-sm font-medium text-slate-700">
                                    Giá: {new Intl.NumberFormat('vi-VN').format(approvingField.price)} VND
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setApprovingField(null)}
                                    disabled={submittingApprove}
                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApprove}
                                    disabled={submittingApprove}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {submittingApprove ? 'Đang duyệt...' : 'Xác nhận duyệt'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default AdminPendingFields;
