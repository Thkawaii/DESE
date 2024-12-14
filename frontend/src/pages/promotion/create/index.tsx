import { Space, Button, Col, Row, Divider, Form, Input, Card, message, DatePicker, InputNumber, Select, Upload } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ImgCrop from "antd-img-crop";
import { useSpring, animated } from "@react-spring/web"; // import react-spring
import { FileImageOutlined } from "@ant-design/icons";
import { PromotionInterface } from "../../../interfaces/IPromotion";
import { CreatePromotion } from "../../../services/https/indexpromotion";


function PromotionCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [status, setStatus] = useState<"active" | "expired">("active");
  const [fileList, setFileList] = useState<any>([]);

  // สมมติว่าเรามี ID สำหรับ discount_type และ status ที่เก็บในตัวแปร
  const discountTypeMap = {
    amount: 1,   // สมมติว่า "amount" คือ ID 1
    percent: 2,  // สมมติว่า "percent" คือ ID 2
  };

  const statusMap = {
    active: 1,   // สมมติว่า "active" คือ ID 1
    expired: 2,  // สมมติว่า "expired" คือ ID 2
  };

  const onFinish = async (values: PromotionInterface) => {
    const promotionData = {
      ...values,
      discount_type_id: discountTypeMap[discountType], // ส่ง discount_type_id
      status_id: statusMap[status], // ส่ง status_id
      photo: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };

    let res = await CreatePromotion(promotionData);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const onChange = ({ fileList: newFileList }: { fileList: any }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src as string;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // Adding animation for the card and form
  const cardAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(-50px)" },
    config: { tension: 250, friction: 20 },
  });

  const formAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(20px)" },
    delay: 100,
    config: { tension: 200, friction: 30 },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "110vh",
        padding: "20px",
        backgroundColor: "rgba(233, 213, 255, 0.4)", // สีพื้นหลังอ่อน
      }}
    >
      {contextHolder}
      <animated.div style={cardAnimation}>
        <Card
          style={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ color: "#6B21A8", textAlign: "center", fontSize: "29px", fontWeight: "bold", marginTop: 0 }}>
            สร้างโปรโมชั่นใหม่
          </h2>
          <Divider style={{ margin: "10px 0" }} />
          {/* รูปภาพโปรโมชั่น */}
          <Row justify="center" style={{ marginBottom: 16 }}>
            <Col xs={4} style={{ textAlign: "center" }}>
              <Form.Item label="รูปภาพโปรโมชั่น" name="photo">
                <ImgCrop rotationSlider>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    {fileList.length < 1 && (
                      <div>
                        <FileImageOutlined style={{ fontSize: "34px" }} />
                        <div style={{ marginTop: 8 }}>อัพโหลด</div>
                      </div>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
          </Row>

          <animated.div style={formAnimation}>
            <Form
              name="promotionCreate"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              style={{
                backgroundColor: "rgba(127, 107, 188, 0.2)", // สีม่วงโปร่งแสง 36%
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Row gutter={[16, 16]}>
                {/* รหัสโปรโมชั่น และ ชื่อโปรโมชั่น */}
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="รหัสโปรโมชั่น"
                        name="promotion_code"
                        rules={[{ required: true, message: "กรุณากรอกรหัสโปรโมชั่น !" }, { max: 20, message: "รหัสโปรโมชั่นต้องไม่เกิน 20 ตัวอักษร !" }]}
                      >
                        <Input placeholder="กรอกรหัส เช่น NEWYEAR2024" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="ชื่อโปรโมชั่น" name="promotion_name" rules={[{ required: true, message: "กรุณากรอกชื่อโปรโมชั่น !" }]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* ประเภทส่วนลด และ ส่วนลด */}
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="ประเภทส่วนลด" name="discount_type_id" rules={[{ required: true, message: "กรุณาเลือกประเภทส่วนลด !" }]}>
                        <Select value={discountType} onChange={(value) => setDiscountType(value)}>
                          <Select.Option value="amount">จำนวนเงิน (บาท)</Select.Option>
                          <Select.Option value="percent">เปอร์เซ็นต์ (%)</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label={discountType === "amount" ? "ส่วนลด (บาท)" : "ส่วนลด (%)"} name="discount" rules={[{ required: true, message: "กรุณากรอกจำนวนส่วนลด !" }]}>
                        <InputNumber min={0} max={discountType === "percent" ? 100 : undefined} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* สถานะโปรโมชั่น และ จำนวนครั้งที่ใช้ได้ */}
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="สถานะโปรโมชั่น" name="status_id" rules={[{ required: true, message: "กรุณาเลือกสถานะโปรโมชั่น !" }]}>
                        <Select value={status} onChange={(value) => setStatus(value)}>
                          <Select.Option value="active">ใช้งานได้</Select.Option>
                          <Select.Option value="expired">ปิดใช้งาน</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="จำนวนครั้งที่ใช้ได้" name="use_limit" rules={[{ required: true, message: "กรุณากรอกจำนวนครั้งที่ใช้ได้ !" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* ระยะทางสูงสุด */}
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="ระยะทาง (กิโลเมตร)" name="distance">
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="วันสิ้นสุดโปรโมชั่น" name="end_date" rules={[{ required: true, message: "กรุณาเลือกวันหมดเขต !" }]}>
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* คำอธิบายโปรโมชั่น */}
                <Col xs={24}>
                  <Form.Item label="คำอธิบายโปรโมชั่น" name="promotion_description" rules={[{ required: true, message: "กรุณากรอกคำอธิบายโปรโมชั่น !" }]}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>

                {/* ปุ่ม */}
                <Col xs={24} sm={24} style={{ textAlign: "center" }}>
                  <Form.Item>
                    <Space size="large">
                      <Link to="/promotion">
                        <Button block style={{ width: "150px" }}>ยกเลิก</Button>
                      </Link>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        block
                        style={{
                          backgroundColor: "#9333EA",
                          borderColor: "#9333EA",
                          color: "#fff",
                          width: "150px", // กำหนดความกว้าง
                        }}
                      >
                        บันทึก
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </animated.div>
        </Card>
      </animated.div>
    </div>
  );
}

export default PromotionCreate;