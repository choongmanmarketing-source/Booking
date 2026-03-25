# LINE LIFF Table Booking

หน้าเว็บสำหรับจองโต๊ะร้านอาหารผ่าน LINE LIFF (LIFF v2 SDK)

## วิธีใช้งาน

1. สร้าง LIFF App ใน LINE Developers Console
2. นำค่า LIFF ID ไปใส่ในไฟล์ `app.js` ตรงตัวแปร `LIFF_ID`
3. ตั้งค่า Endpoint URL ให้ชี้มายัง URL ที่โฮสต์ไฟล์ `index.html`
4. เปิด LIFF URL ผ่าน LINE เพื่อทดสอบการจอง

## ฟีเจอร์

- ฟอร์มจองโต๊ะ (ชื่อ, เบอร์โทร, วันที่, เวลา, จำนวนคน, โซนที่นั่ง, หมายเหตุ)
- ตรวจสอบวันเวลาจองต้องเป็นอนาคต
- ถ้าเปิดใน LINE client จะส่งข้อความยืนยันกลับไปยังแชตด้วย `liff.sendMessages`
- บันทึกประวัติการจองล่าสุดใน `localStorage`

## โครงสร้างไฟล์

- `index.html` : โครงหน้า LIFF
- `style.css` : สไตล์ UI สำหรับมือถือ
- `app.js` : การเชื่อมต่อ LIFF และ logic การจอง
