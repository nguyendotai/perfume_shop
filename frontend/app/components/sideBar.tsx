"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ILoai, ISanPham } from "./constructorData";

interface SideBarProps {
    onFilterByPrice: (maxPrice: number) => void;
}

export default function SideBar({ onFilterByPrice }: SideBarProps) {
    const [categories, setCategories] = useState<ILoai[]>([]);
    const [products, setProducts] = useState<ISanPham[]>([]);
    const [priceRange, setPriceRange] = useState<number>(20000000);

    useEffect(() => {
        fetch(`http://localhost:3000/api/danhmuc`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Lỗi danh mục: ", err));

        fetch(`http://localhost:3000/api/sanpham`)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Lỗi sản phẩm: ", err));
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((sp) => sp.gia <= priceRange);
    }, [priceRange, products]);

    const categoriesWithProductCount = useMemo(() => {
        return categories.map((cat) => {
            const productCount = filteredProducts.filter((sp) => sp.danh_muc_id === cat.id).length;
            return { ...cat, productCount };
        });
    }, [filteredProducts, categories]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(e.target.value);
        setPriceRange(newPrice);
        onFilterByPrice(newPrice);
    };

    return (
        <aside className="w-64 bg-white ">
            {/* DANH MỤC */}
            <h2 className="font-bold text-lg mb-4">DANH MỤC</h2>
            <ul className="text-sm">
                {categoriesWithProductCount.map((item) => (
                    <li key={item.id}>
                        <Link
                            href={`/categories/${item.id}`}
                            className={`py-2 font-[16px] block ${
                                item.productCount > 0 ? "text-gray-700 hover:text-black" : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {item.ten_danh_muc} {item.productCount > 0 ? `(${item.productCount})` : "(0)"}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* LỌC THEO GIÁ */}
            <h2 className="font-bold text-lg mt-6 mb-4">LỌC THEO GIÁ</h2>
            <input
                type="range"
                min="0"
                max="20000000"
                step="1000000"  
                value={priceRange}
                onChange={handlePriceChange}
                className="w-full accent-yellow-500"
            />
            <div className="flex justify-between text-gray-700 text-sm mt-2">
                
                <span>{priceRange.toLocaleString()} đ</span>
            </div>
        </aside>
    );
}
