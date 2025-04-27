export interface ILoai {
    id: number;
    ten_danh_muc: string;
    an_hien: number;
}

export interface ISanPham {
    id: number;
    ten_sp: string;
    mo_ta: string;
    gia: number;
    gia_km: number;
    danh_muc_id: number;
    brand: string;
    gender: string;
    nam_ra_mat: number;
    nong_do: string;
    phong_cach: string;
    huong_dau: string;
    huong_giua: string;
    huong_cuoi: string;
    hinh_anh: string;
    an_hien: number;
    dung_tich: number;
    createdAt: string;
}

export interface ICart {
    id: number;
    ten_sp: string;
    so_luong: number;
    hinh_anh: string;
    gia: number;
    gia_km?: number;
    quantity: number;
}

export interface CartState {
    items: ICart[];
}

export interface IUser {
    id: number;
    ho_ten: string;
    email: string;
    role: 0 | 1; // Có thể mở rộng nếu cần
    anh_dai_dien: string | File | null | undefined;
    so_dien_thoai?: string;
    dia_chi?: string;
    token?: string;
    createdAt: string;
}

export interface IDangNhap {
    email: string;
    mat_khau: string;
}

export interface IDangKy {
    ho_ten: string;
    email: string;
    password: string;
    xac_nhan_mk: string;
}
