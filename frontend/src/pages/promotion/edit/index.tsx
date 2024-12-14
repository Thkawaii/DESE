import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  InputNumber,
  Select,
  Upload,
} from "antd";
import { PromotionInterface } from "../../../interfaces/IPromotion";
import { GetPromotionById, UpdatePromotionById } from "../../../services/https/indexpromotion";
import { useNavigate, Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop"; // Image crop for upload
import { useSpring, animated } from "@react-spring/web"; // Animation
import { FileImageOutlined } from "@ant-design/icons";


function PromotionEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any>([]); // Store uploaded files
  const [discountType, setDiscountType] = useState<"amount" | "percent">("amount");
  const [status, setStatus] = useState<"active" | "expired">("active");
  const [form] = Form.useForm();

  // Fetch promotion data by ID
  const getPromotionById = async (id: string) => {
    let res = await GetPromotionById(id);

    if (res.status === 200) {
      const promotion = res.data;
      form.setFieldsValue({
        promotion_code: promotion.promotion_code || "",
        promotion_name: promotion.promotion_name || "",
        discount_type_id: promotion.discount_type_id === 2 ? "percent" : "amount", // Map to string
        discount: promotion.discount || "",
        status_id: promotion.status_id === 1 ? "active" : "expired", // Map to string
        use_limit: promotion.use_limit || 0,  // Default to 0 if not provided
        distance: promotion.distance || null,  // Optional distance
        end_date: promotion.end_date ? dayjs(promotion.end_date) : null,
        promotion_description: promotion.promotion_description || "",
      });
      setDiscountType(promotion.discount_type_id === 2 ? "percent" : "amount");
      setStatus(promotion.status_id === 1 ? "active" : "expired");
      setFileList(promotion.photo ? [{ url: promotion.photo }] : []);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      setTimeout(() => {
        navigate("/promotion");
      }, 2000);
    }
  };

  // Handle form submission
  const onFinish = async (values: PromotionInterface) => {
    const promotionData = {
      ...values,
      discount_type_id: discountType === "percent" ? 2 : 1, // Map to numeric value
      status_id: status === "active" ? 1 : 2, // Map to numeric value
      photo: fileList.length > 0 ? fileList[0].thumbUrl : null,
    };

    let res = await UpdatePromotionById(id || "", promotionData);

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

  useEffect(() => {
    if (id) {
      getPromotionById(id);
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลโปรโมชั่น",
      });
      navigate("/promotion");
    }
  }, [id]);

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
    <div style={{ display: "flex", justifyContent: "center", padding: "20px", backgroundColor: "rgba(233, 213, 255, 0.4)" }}>
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
            แก้ไขข้อมูล โปรโมชั่น
          </h2>
          <Divider style={{ margin: "10px 0" }} />

          {/* Image Upload */}
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

          {/* Animated Form Wrapper */}
          <animated.div style={formAnimation}>
            <Form
              name="promotionEdit"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              style={{
                backgroundColor: "rgba(127, 107, 188, 0.3)",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <Row gutter={[16, 16]}>
                {/* Promotion Code and Name */}
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

                {/* Discount Type and Amount */}
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
                        <InputNumber min={0} max={discountType === "percent" ? 100 : 99999999} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* New Row for Status and Use Limit */}
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
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                {/* New Row for End Date, Distance, Status and Use Limit */}
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="วันหมดเขต" name="end_date" rules={[{ required: true, message: "กรุณากำหนดวันที่สิ้นสุด !" }]}>
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item label="ระยะทางสูงสุด (กิโลเมตร)" name="distance">
                        <InputNumber min={0} max={1000} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>

                

                {/* Description */}
                <Col xs={24}>
                  <Form.Item label="รายละเอียดโปรโมชั่น" name="promotion_description" rules={[{ required: true, message: "กรุณากรอกรายละเอียดโปรโมชั่น !" }]}>
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="center" gutter={[16, 16]}>
                <Col>
                  <Link to="/promotion">
                    <Button
                      block
                      style={{
                        width: "150px",
                        backgroundColor: "#f0f0f0",
                        borderColor: "#d1d1d1",
                        color: "#333",
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Link>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      width: "150px",
                      backgroundColor: "#9333EA",
                      borderColor: "#9333EA",
                      color: "#fff",
                    }}
                  >
                    บันทึก
                  </Button>
                </Col>
              </Row>
            </Form>
          </animated.div>
        </Card>
      </animated.div>
    </div>
  );
}

export default PromotionEdit;
