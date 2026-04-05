import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
    const [fields, setFields] = useState([]);
    const [filters, setFilters] = useState({ 
        type: '', 
        maxPrice: '', 
        time: '' 
    });

    const fetchFields = async () => {
        try {
      
            const res = await axios.get('http://localhost:8080/api/fields/search', { 
                params: filters 
            });
            setFields(res.data);
        } catch (err) {
            console.error("Lỗi khi fetch dữ liệu sân:", err);
        }
    };

    useEffect(() => {
        // fetchFields();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFields();
    };

    return (
        <div className="p-6 mx-auto search-page max-w-7xl">
            <h1 className="mb-8 text-3xl font-bold text-center text-green-700">Tìm Kiếm Sân Thể Thao</h1>
            
    
            <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 p-6 mb-10 bg-white border border-gray-100 shadow-lg md:grid-cols-4 rounded-xl">
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Loại sân</label>
                    <select 
                        className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option value="">Tất cả</option>
                        <option value="Football">Sân bóng đá</option>
                        <option value="Badminton">Sân cầu lông</option>
                        <option value="Tennis">Sân Tennis</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Giá tối đa (VNĐ)</label>
                    <input 
                        type="number" 
                        placeholder="Ví dụ: 300000" 
                        className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Giờ đặt sân</label>
                    <input 
                        type="time" 
                        className="p-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setFilters({...filters, time: e.target.value})}
                    />
                </div>

                <div className="flex items-end">
                    <button type="submit" className="w-full py-2 font-bold text-white transition duration-300 bg-green-600 rounded-md hover:bg-green-700">
                        Tìm Kiếm Ngay
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {fields.length > 0 ? fields.map(field => (
                    <div key={field.id} className="overflow-hidden transition-shadow duration-300 bg-white border shadow-sm rounded-2xl hover:shadow-xl">
                        <div className="h-48 bg-gray-200">
                            {/* Bạn có thể thay bằng field.imageUrl nếu có */}
                            <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=500" 
                                 alt={field.name} 
                                 className="object-cover w-full h-full" />
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-800">{field.name}</h3>
                                <span className="px-2 py-1 text-xs font-semibold text-green-700 uppercase bg-green-100 rounded-full">
                                    {field.type}
                                </span>
                            </div>
                            <p className="mb-4 text-2xl font-bold text-orange-600">
                                {field.pricePerHour?.toLocaleString()} <span className="text-sm font-normal text-gray-500">VNĐ/giờ</span>
                            </p>
                            <button className="w-full py-2 font-bold text-green-600 transition duration-300 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center border-2 border-dashed rounded-lg col-span-full bg-gray-50">
                        <p className="text-gray-500">Không tìm thấy sân nào khớp với yêu cầu của bạn.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;