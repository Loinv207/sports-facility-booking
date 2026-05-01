import React, { useState } from 'react';
import axios from 'axios';
import { Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminSidebar from './AdminSidebar';

const toast = {
  error: (message) => window.alert(message),
  success: (message) => window.alert(message),
};

const AdminNotification = () => {
  const [target, setTarget] = useState("ALL");
  const [form, setForm] = useState({ title: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleBroadcast = async () => {
    if (!form.title || !form.message) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/notifications/broadcast?target=${target}`, {
        title: form.title,
        message: form.message,
        userId: null 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Thông báo đã được gửi đi!");
      setForm({ title: '', message: '' });
    } catch {
      toast.error("Lỗi khi gửi thông báo hệ thống.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Megaphone className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Hệ thống thông báo</h1>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Gửi tin nhắn hàng loạt</CardTitle>
          <CardDescription>Tin nhắn này sẽ xuất hiện trong mục thông báo của người nhận.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Chọn đối tượng */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Gửi đến nhóm đối tượng</label>
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ALL">Tất cả người dùng</option>
              <option value="USER">Chỉ khách thuê sân (User)</option>
              <option value="OWNER">Chỉ chủ sân (Owner)</option>
            </select>
          </div>

          {/* Tiêu đề */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Tiêu đề</label>
            <Input 
              placeholder="Nhập tiêu đề thông báo..." 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>

          {/* Nội dung */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Nội dung chi tiết</label>
            <textarea 
              placeholder="Nhập nội dung cần thông báo..." 
              className="min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-5">
          <Button 
            onClick={handleBroadcast} 
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
          >
            {isSending ? "Đang xử lý..." : "Gửi thông báo ngay"}
          </Button>
        </CardFooter>
      </Card>
      </div>
      </main>
    </div>
  );
};

export default AdminNotification;
