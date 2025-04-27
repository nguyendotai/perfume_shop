import Image from "next/image";
export default function Banner() {
  return (
    <div className="w-full mx-auto flex gap-3 justify-between">
      {/* Banner lớn */}
      <div className="w-[65%] overflow-hidden rounded-lg relative">
        <Image
          src="/banner-1.png"
          alt="Banner chính"
          width={800}
          height={500}
          className="rounded-lg object-cover w-full h-[500px] transition duration-300 ease-in-out hover:scale-105"
        />
      </div>

      {/* Banner nhỏ */}
      <div className="w-[35%] flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg relative">
          <Image
            src="/banner-2.png"
            alt="Banner nhỏ 1"
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-[250px] transition duration-200 ease-in-out hover:scale-105"
          />
        </div>
        <div className="overflow-hidden rounded-lg relative">
          <Image
            src="/banner.png"
            alt="Banner nhỏ 2"
            width={400}
            height={250}
            className="rounded-lg object-cover w-full h-[250px] transition duration-200 ease-in-out hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
