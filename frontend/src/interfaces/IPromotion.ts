export interface PromotionInterface {
    id?: number; // ID ของโปรโมชั่น (Optional)
    promotion_code: string; // รหัสโปรโมชั่น (required ใน backend)
    promotion_name?: string; // ชื่อโปรโมชั่น
    promotion_description?: string; // คำอธิบายโปรโมชั่น
    discount: number; // จำนวนส่วนลด (required)
    end_date: string; // วันที่หมดเขตโปรโมชั่น (ISO8601, required)
    use_limit: number; // จำนวนครั้งที่สามารถใช้โค้ดได้ (required)
    use_count?: number; // จำนวนที่ใช้แล้ว
    distance?: number; // ระยะทางสูงสุด
    photo?: string; // รูปโปรโมชั่น (Base64)
  
    StatusID?: number;
    DiscountTypeID?: number;
  
  }
  