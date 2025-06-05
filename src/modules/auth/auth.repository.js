const { UserSchema } = require('../../models/auth/userSchema.js');
const pagination = require('../../utils/pagination.js');
const BaseRepository = require('../base/base.repository.js');
const moment = require("moment-timezone");


class AuthRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }
  async getUserById(id) {
    return await this.#model.findById(id).select('-password').exec();

  }
  async updateUserPassword(userId, password) {
    const user = await this.#model.findByIdAndUpdate(userId, { password }, { new: true });
    return user;
  }

  async getAuthByEmail(email) {
    return await this.#model.findOne({ email }).exec();
  }
  async setUserOTP(id, OTP) {
    const user = await this.#model.findByIdAndUpdate(id, { otp: OTP, otpTime: moment.tz("Asia/Dhaka").toDate() }, { new: true });
    return user;
  }
  async getAuthByPhone(phone) {
    return await this.#model.findOne({ phone }).exec();
  }

   async getAuthByEmail(email) {
    if (!email) {
      // email না থাকলে বা ছোট হলে খালি array ফেরত দাও
      return [];
    }
    const users = await this.#model.find(
      { email: { $regex: email, $options: 'i' } },
      { _id: 1, email: 1, name: 1 }
    ).limit(10);
    return users;
  }

  async getAuthByEmailOrPhone(email, phone) {
    const query = { $or: [] };
    if (email) {
      query.$or.push({ email });
    }
    if (phone) {
      query.$or.push({ phone });
    }
    if (query.$or.length === 0) {
      return null;
    }
    const user = await this.#model.findOne(query).exec();
    return user;
  }


  async authUserSingUp(payload, session) {
    const { name, email, phone, password, roleRef , userId, image} = payload;
    const signingUpObject = {
      name,
      email,
      password,
      phone,
      roleRef,
      userId,
      image,
    }
    const user = await this.#model.create([signingUpObject], { session });

    return user;
  }

  async getAllUser(payload) {

    const users = await this.#model.find({
    }).sort({ createdAt: -1 }).select("-password -otp")

    return users

  }

  async createUserPayment(id, amount, session) {
    // findby id and update 
    const user = await this.#model.findByIdAndUpdate(id,
      {
        $inc: {
          receivedAmount: amount,
          amount: -amount
        },
      }, { new: true, session });

    return user;
  }


}

module.exports = new AuthRepository(UserSchema);

