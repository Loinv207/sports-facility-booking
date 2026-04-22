// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            
            
//             localStorage.setItem('token', response.data.accessToken);
//             localStorage.setItem('userRole', response.data.user.role);

//             alert("Đăng nhập thành công!");
            
            
//             if (response.data.user.role === 'ADMIN') {
//                 navigate('/admin/fields/pending');
//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             alert("Sai tài khoản hoặc mật khẩu!");
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
//             <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-xl w-96">
//                 <h2 className="mb-6 text-2xl font-bold">Đăng nhập hệ thống</h2>
//                 <input 
//                     name="usernameOrEmail" 
//                     placeholder="Username hoặc Email" 
//                     onChange={handleChange}
//                     className="w-full p-3 mb-4 bg-gray-700 rounded outline-none"
//                 />
//                 <input 
//                     name="password" 
//                     type="password" 
//                     placeholder="Mật khẩu" 
//                     onChange={handleChange}
//                     className="w-full p-3 mb-6 bg-gray-700 rounded outline-none"
//                 />
//                 <button type="submit" className="w-full p-3 font-bold rounded bg-sky-600 hover:bg-sky-700">
//                     Đăng nhập
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Login;




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
            
            // Lưu thông tin đăng nhập - Dùng tên key thống nhất cho toàn bộ App
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('role', response.data.user.role); // Lưu là 'role'
            localStorage.setItem('username', response.data.user.username || '');
            localStorage.setItem('fullName', response.data.user.fullName || response.data.user.fullname || '');
            localStorage.setItem('email', response.data.user.email || '');

            alert("Đăng nhập thành công!");
            
            // Điều hướng dựa trên vai trò
            if (response.data.user.role === 'ADMIN') {
                navigate('/admin/dashboard'); 
            } else if (response.data.user.role === 'OWNER') {
                navigate('/owner-management');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white bg-slate-900">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border shadow-2xl bg-slate-800 rounded-2xl border-slate-700">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-sky-400">Sport Now</h2>
                    <p className="mt-2 text-slate-400">Đăng nhập để quản lý hệ thống</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-300">Tài khoản</label>
                        <input 
                            name="usernameOrEmail" 
                            type="text"
                            placeholder="Username hoặc Email" 
                            onChange={handleChange}
                            className="w-full p-3 transition-all border rounded-lg outline-none bg-slate-700 border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-slate-300">Mật khẩu</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={handleChange}
                            className="w-full p-3 transition-all border rounded-lg outline-none bg-slate-700 border-slate-600 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full p-3 mt-8 font-bold text-white rounded-lg bg-sky-600 hover:bg-sky-500 transform active:scale-[0.98] transition-all shadow-lg shadow-sky-900/20">
                    Đăng nhập ngay
                </button>
                
                <p className="mt-6 text-sm text-center text-slate-400">
                    Bạn chưa có tài khoản? <span className="cursor-pointer text-sky-400 hover:underline" onClick={() => navigate('/register')}>Đăng ký</span>
                </p>
            </form>
        </div>
    );
};

export default Login;
