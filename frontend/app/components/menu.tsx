import Link from "next/link";

export default function Menu() {
    return (
        <div className="flex justify-center items-center w-[80%] gap-8">
            {[
                { name: "CỬA HÀNG", path: "/store" },
                { name: "SALE", path: "/sale" },
                { name: "NHÃN HÀNG", path: "/brands" },
                { name: "BLOG", path: "/blog" }
            ].map((item, index) => (
                <div key={index} className="font-semibold relative group">
                    <Link href={item.path} className="block transition-colors group-hover:text-amber-500">
                        {item.name}
                    </Link>
                </div>
            ))}
        </div>
    );
}
