import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Image, Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";  // นำเข้า EditOutlined
import type { ColumnsType } from "antd/es/table";
import { GetPromotions, DeletePromotionById } from "../../services/https/indexpromotion";
import { PromotionInterface } from "../../interfaces/IPromotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Columns for the table
  const columns: ColumnsType<PromotionInterface> = [
    {
      title: "ภาพโปรโมชัน",
      dataIndex: "photo",
      key: "photo",
      render: (text) =>
        text ? (
          <Image width={50} src={text} alt="Promotion" />
        ) : (
          "-"
        ),
    },
    {
      title: "รหัสโปรโมชั่น",
      dataIndex: "promotion_code",
      key: "promotion_code",
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "promotion_name",
      key: "promotion_name",
    },
    {
      title: "ประเภทส่วนลด",
      dataIndex: "discount_type_id",
      key: "discount_type_id",
      render: (text) => {
        if (text === 1) return "จำนวนเงิน (฿)";
        if (text === 2) return "เปอร์เซ็นต์ (%)";
        return "ไม่ระบุ"; // Fallback for any other values
      },
    },
    {
      title: "ส่วนลด ",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "สถานะ",
      dataIndex: "status_id",
      key: "status_id",
      render: (text) => {
        if (text === 1) return "ใช้งานได้"; // Active
        if (text === 2) return "ปิดการใช้งาน"; // Expired
        return "ไม่ระบุ"; // Fallback for any other values
      },
    },
    {
      title: "จำนวนครั้งที่ใช้ได้",
      dataIndex: "use_limit",
      key: "use_limit",
    },
    {
      title: "ระยะทาง",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "วันหมดเขต",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
    },
    {
      title: "คำอธิบายโปรโมชั่น",
      dataIndex: "promotion_description",
      key: "promotion_description",
      render: (text) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal", maxWidth: "200px" }}>
          {text || "-"}
        </div>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="dashed"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deletePromotionById(record.ID!)} // ใช้ 'id' ตาม interface
          style={{ borderColor: "#47456C", color: "#47456C" }} // สีปุ่มลบ
        >
          ลบ
        </Button>
      ),
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            if (record.ID) {
              navigate(`/promotion/edit/${record.ID}`);
            } else {
              messageApi.error("ไม่พบข้อมูลโปรโมชั่นที่ต้องการแก้ไข");
            }
          }}
          style={{ backgroundColor: "#575A83", borderColor: "#575A83" }} // สีปุ่มแก้ไข
          icon={<EditOutlined />} // เพิ่มไอคอน EditOutlined
        >
          แก้ไขข้อมูล
        </Button>
      ),
    },
  ];

  // Fetch promotions data
  const getPromotions = async () => {
    try {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
        setFilteredPromotions(res.data); // Initially set filtered promotions to all promotions
      } else {
        setPromotions([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถดึงข้อมูลโปรโมชันได้");
    }
  };

  // Delete promotion by ID
  const deletePromotionById = async (id: number) => {
    try {
      const res = await DeletePromotionById(String(id)); // แปลง id เป็น string
      if (res.status === 200) {
        messageApi.success(res.data.message);
        getPromotions(); // Refresh data
      } else {
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถลบโปรโมชันได้");
    }
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPromotions(value);
  };

  // Filter promotions by code
  const filterPromotions = (search: string) => {
    const filtered = promotions.filter((promotion) =>
      promotion.promotion_code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPromotions(filtered);
  };

  // Fetch data on component mount
  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2 style={{ color: "#7F6BCC" }}>จัดการโปรโมชั่น</h2> {/* สีหัวข้อ */}
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Space>
            <Input
              placeholder="ค้นหารหัสโปรโมชั่น"
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined />} // ใส่ไอคอนในช่องค้นหา
            />
            <Link to="/promotion/create">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ backgroundColor: "#9333EA", borderColor: "#9333EA" }} // ปุ่มสร้าง
              >
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPromotions} // ใช้ข้อมูลที่กรองแล้ว
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}

export default Promotion;
