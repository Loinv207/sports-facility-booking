import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            
            // LƯU QUAN TRỌNG: Lưu token vào localStorage để các trang khác dùng
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('userRole', response.data.user.role);

            alert("Đăng nhập thành công!");
            
            // Chuyển hướng đến trang admin nếu là ADMIN
            if (response.data.user.role === 'ADMIN') {
                navigate('/admin/fields/pending');
            } else {
                navigate('/');
            }
        } catch (error) {
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
            <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-xl w-96">
                <h2 className="mb-6 text-2xl font-bold">Đăng nhập hệ thống</h2>
                <input 
                    name="usernameOrEmail" 
                    placeholder="Username hoặc Email" 
                    onChange={handleChange}
                    className="w-full p-3 mb-4 bg-gray-700 rounded outline-none"
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Mật khẩu" 
                    onChange={handleChange}
                    className="w-full p-3 mb-6 bg-gray-700 rounded outline-none"
                />
                <button type="submit" className="w-full p-3 font-bold rounded bg-sky-600 hover:bg-sky-700">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default Login;