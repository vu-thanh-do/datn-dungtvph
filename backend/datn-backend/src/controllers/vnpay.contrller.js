import dotenv from 'dotenv';
import crypto from 'crypto';
import querystring from 'qs';
import moment from 'moment';
import Voucher from '../models/voucher.model.js';
import Enviroment from '../utils/checkEnviroment.js';
dotenv.config();

process.env.TZ = 'Asia/Ho_Chi_Minh';

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

const checkoutVnpay = {
  payment: async (req, res) => {
    try {
      const secretKey = process.env.VNP_HASHSECRET;
      let vnpUrl = process.env.VNP_URL;
      const ip =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const amount = req.body.total;

      if (req.body.moneyPromotion?.voucherId) {
        const userUsedVoucher = req.body.inforOrderShipping.phone;
        const checkVoucher = await Voucher.findById({ _id: req.body.moneyPromotion.voucherId });
        if (!checkVoucher) {
          return res.status(400).json({ message: 'Không tìm thấy mã voucher' });
        }
        if (checkVoucher.discount == 0) {
          return res.status(400).json({ message: 'Voucher đã hết lượt dùng!' });
        }
        const exitUser = checkVoucher.user_used.includes(userUsedVoucher);
        if (exitUser) {
          return res.status(400).json({ message: 'Đã hết lượt dùng Voucher' });
        }
      }

      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE;
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_BankCode'] = 'NCB';
      vnp_Params['vnp_CreateDate'] = moment(new Date()).format('YYYYMMDDHHmmss');
      vnp_Params['vnp_CurrCode'] = 'VND';
      vnp_Params['vnp_IpAddr'] = ip;
      vnp_Params['vnp_Locale'] = 'vn';
      vnp_Params['vnp_OrderInfo'] = 'Thanh_toan_don_hang';
      vnp_Params['vnp_ReturnUrl'] = `${Enviroment()}/products/checkout/payment-result?userId=${
        req.body.user
      }&expire=${moment(new Date()).add(15, 'minute').toDate().getTime()}`;
      vnp_Params['vnp_TxnRef'] = moment(new Date()).format('DDHHmmss');

      vnp_Params['vnp_OrderType'] = 'other';

      vnp_Params = sortObject(vnp_Params);
      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(signData).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
      res.send({ url: vnpUrl });
    } catch (error) {
      return res.status(500, { message: 'Error server' });
    }
  },
};

export default checkoutVnpay;
