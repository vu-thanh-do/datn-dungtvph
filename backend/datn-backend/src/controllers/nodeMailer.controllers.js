import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();
export const sendEmailOrder = async (data) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'longhdph28352@fpt.edu.vn',
      pass: 'qnwggskitxtjpaax',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: '"Hey 🙋🏻‍♂️" <milktea@gmail.com>',
    subject: data.subject,
    text: data.text,
    html: data.html
      ? data.html
      : ` 
  <div class="col-md-12">
    <div class="row">
      <div class="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
  
        <div class="row">
          <div class="receipt-header receipt-header-mid">
            <div class="col-xs-8 col-sm-8 col-md-8 text-left">
              <div class="receipt-right">
                <h3><b>Dear ${data?.userInfo?.name} </b></h3>
  
                <p><b>Số Điện thoại :</b> ${data.userInfo?.phone ? data.userInfo?.phone : ''}</p>
                <p><b>Thời gian :</b> ${data.createdAt}</p>
                <p><b>Hình thức thanh toán:</b> ${
                  data.payment == 'vnpay' ? 'VNPAY' : 'Thanh toán khi nhận hàng'
                }</p>
                <p><b>Id đơn hàng:</b> ${data.orderId}</p>
                <p><b>Trạng thái đơn hàng:</b> ${data.statusOrder}</p>
                <p><b>Địa chỉ :</b>${data?.userInfo?.address}</p>
              </div>
              
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4">
              <div class="receipt-left">
                <h3>HÓA ĐƠN ĐẶT HÀNG TRÀ SỮA CONNECT</h3>
              </div>
            </div>
          </div>
        </div>
  
        <div>
          <table class="table table-bordered " style="text-align: center;border: 1px solid #cccc;padding: 5px;">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Ảnh</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Giá </th>
              </tr>
            </thead>
            <tbody>
              ${data?.items
                ?.map(
                  (product, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${product.name}</td>
                <td><img width="100" height="100" src="${product.image}" /></td>
                <td>${product.quantity}</td>
                <td>${product.price} đ</td>
              </tr>
              `
                )
                .join('')}
              <tr>
                <td colspan="4">Phí vận chuyển </td>
                <td style="text-align: right">+ ${data?.priceShipping} VND</td>
              </tr>
              <tr>
                <td colspan="4">Voucher </td>
                <td style="text-align: right">- ${
                  data?.moneyPromotion?.price ? data.moneyPromotion?.price : 0
                } VND</td>
              </tr>
              <tr >
                <td colspan="4">Tổng cộng </td>
                <td style="text-align: right">${data.total} VND</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="receipt-header receipt-header-mid receipt-footer">
            <div class="col-xs-8 col-sm-8 col-md-8 text-left">
              <div class="receipt-right">
  
                <h4 style="color: rgb(140, 140, 140);">Cảm ơn bạn rất nhiều 💕💕💕!</h4>
              </div>
            </div>
  
          </div>
        </div>
      </div>
  
    </div>
  </div>
  
  `,
    to: data.to,
  });
};
