import React, { useState } from 'react';
import axios from 'axios';
import { Send, Bell, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
      
      await axios.post(`/api/notifications/broadcast?target=${target}`, {
        title: form.title,
        message: form.message,
        userId: null 
      });
      
      toast.success("Thông báo đã được gửi đi!");
      setForm({ title: '', message: '' });
    } catch (error) {
      toast.error("Lỗi khi gửi thông báo hệ thống.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
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
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn đối tượng nhận" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả người dùng</SelectItem>
                <SelectItem value="USER">Chỉ khách thuê sân (User)</SelectItem>
                <SelectItem value="OWNER">Chỉ chủ sân (Owner)</SelectItem>
              </SelectContent>
            </Select>
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
            <Textarea 
              placeholder="Nhập nội dung cần thông báo..." 
              className="min-h-[120px]"
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
  );
};

export default AdminNotification;