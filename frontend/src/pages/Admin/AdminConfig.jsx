import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Settings2, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminConfig = () => {
  const [sportsTypes, setSportsTypes] = useState([]);
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [commissionRate, setCommissionRate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resTypes, resComm] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/admin/config/commission')
      ]);
      setSportsTypes(resTypes.data);
      setCommissionRate(resComm.data.commissionRate);
    } catch (error) {
      toast.error("Không thể tải dữ liệu cấu hình");
    }
  };

  const handleAddType = async () => {
    if (!newType.name) return toast.warning("Vui lòng nhập tên loại sân");
    try {
      await axios.post('/api/categories', newType);
      setNewType({ name: '', description: '' });
      fetchData();
      toast.success("Đã thêm loại sân mới");
    } catch (error) {
      toast.error("Lỗi khi thêm loại sân");
    }
  };

  const handleUpdateCommission = async () => {
    try {
      await axios.put('/api/admin/config/commission', Number(commissionRate), {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success("Cập nhật tỷ lệ hoa hồng thành công");
    } catch (error) {
      toast.error("Lỗi cập nhật cấu hình");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình hệ thống</h1>
      </div>

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
                <Label htmlFor="typeName">Tên loại sân</Label>
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
                  {sportsTypes.map((type: any) => (
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
                <Label htmlFor="rate">Phần trăm (%)</Label>
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
    </div>
  );
};

export default AdminConfig;