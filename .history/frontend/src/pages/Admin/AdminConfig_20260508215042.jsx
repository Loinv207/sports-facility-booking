import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Settings2, LayoutGrid, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminSidebar from './AdminSidebar';

const AdminConfig = () => {
  const [sportsTypes, setSportsTypes] = useState([]);
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [commissionRate, setCommissionRate] = useState("");
  const [statusMessage, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState('success');

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const authConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const [resTypes, resComm] = await Promise.all([
        axios.get('/api/categories', authConfig),
        axios.get('/api/admin/config/commission', authConfig)
      ]);
      setSportsTypes(resTypes.data);
      setCommissionRate(resComm.data.commissionRate);
    } catch {
      setStatusTone('error');
      setStatusMessage("Không thể tải dữ liệu cấu hình");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleAddType = async () => {
    if (!newType.name) {
      setStatusTone('error');
      setStatusMessage("Vui lòng nhập tên loại sân");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/categories', newType, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewType({ name: '', description: '' });
      fetchData();
      setStatusTone('success');
      setStatusMessage("Đã thêm loại sân mới");
    } catch {
      setStatusTone('error');
      setStatusMessage("Lỗi khi thêm loại sân");
    }
  };

  const handleUpdateCommission = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/admin/config/commission', Number(commissionRate), {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setStatusTone('success');
      setStatusMessage("Cập nhật tỷ lệ hoa hồng thành công");
    } catch {
      setStatusTone('error');
      setStatusMessage("Lỗi cập nhật cấu hình");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình hệ thống</h1>
      </div>

      {statusMessage ? (
        <div className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-4 text-sm ${
          statusTone === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-rose-200 bg-rose-50 text-rose-800'
        }`}>
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/*  QUẢN LÝ LOẠI SÂN  */}
        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Danh mục loại sân</CardTitle>
            </div>
            <CardDescription>Thêm hoặc xóa các loại sân có trong hệ thống (Sân 5, Sân 7, Cầu lông...)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 items-end">
              <div className="grid w-full items-center gap-1.5">
                <label htmlFor="typeName" className="text-sm font-medium">Tên loại sân</label>
                <Input 
                  id="typeName" 
                  placeholder="Ví dụ: Sân bóng đá 11 người" 
                  value={newType.name}
                  onChange={(e) => setNewType({...newType, name: e.target.value})}
                />
              </div>
              <Button onClick={handleAddType} className="flex gap-2">
                <Plus className="w-4 h-4" /> Thêm
              </Button>
            </div>

            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Tên loại sân</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sportsTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">#{type.id}</TableCell>
                      <TableCell>{type.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* CẤU HÌNH HOA HỒNG */}
        <div className="space-y-6">
          <Card className="shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle>Tỷ lệ hoa hồng</CardTitle>
              <CardDescription>Thiết lập % phí hệ thống thu trên mỗi đơn đặt sân</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="rate" className="text-sm font-medium">Phần trăm (%)</label>
                <div className="relative">
                  <Input 
                    id="rate" 
                    type="number" 
                    className="pr-8 text-xl font-semibold text-primary"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">
                * Lưu ý: Thay đổi này sẽ áp dụng cho tất cả các Booking mới từ thời điểm này.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateCommission} className="w-full gap-2 py-6 text-lg">
                <Save className="w-5 h-5" /> Lưu cấu hình
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
      </main>
    </div>
  );
};

export default AdminConfig;
