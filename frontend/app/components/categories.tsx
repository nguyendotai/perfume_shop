"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ILoai } from "./constructorData";

export default function Categories() {
     const [category, setCategory] = useState<ILoai[]>([]);
    
        useEffect(() => {
            fetch(`http://localhost:3000/api/danhmuc`)
            .then((res) => res.json())
            .then((data) => setCategory(data))
            .catch((err) => console.log(`Lỗi: `, err));
        }, [])
    return (
        <div className="flex justify-between items-center gap-5">
            {category.map((item) => (
                <div key={item.id} className="relative group py-3 ">
                    <Link href={`/categories/${item.id}`} className="font-medium text-[16px] block text-white  relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-500 after:transition-all after:duration-300 group-hover:after:w-full ">
                        {item.ten_danh_muc}
                    </Link>
                </div>
            ))}
        </div>
    );
}
