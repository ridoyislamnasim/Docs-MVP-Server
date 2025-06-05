const { NotFoundError } = require('../../utils/errors.js');
const BaseService = require('../base/base.service.js');
const bcrypt = require("bcryptjs");

const { isMainThread } = require("worker_threads");
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt.js');
const authRepository = require('./auth.repository.js');
// const isArrayElementExist = require('../../utils/isArrayElementExist.js');
// const { convertFileNameWithPdfExt } = require('../../middleware/upload/convertFileNameWithPdfExt.js');
// const { convertFileNameWithWebpExt } = require('../../middleware/upload/convertFileNameWithWebpExt.js');
// const { uploadWorker } = require('../../middleware/upload/uploadWorker.js');
// const { convertImgArrayToObject } = require('../../middleware/upload/convertImgArrayToObject.js');
// const { removeUploadFile } = require('../../middleware/upload/removeUploadFile.js');
const Email = require('../../utils/Email.js');
const OTPGenerate = require('../../utils/OTPGenerate.js');
// const roleRepository = require('../role/role.repository.js');
const { idGenerate } = require('../../utils/IdGenerator.js');
const ImgUploader = require('../../middleware/upload/ImgUploder.js');

class AuthService extends BaseService {
    #repository;
    // #roleRepository;
    constructor(repository,  serviceName) {
        super(repository,  serviceName);
        this.#repository = repository;
    }

    async authUserSingUp(payload,payloadFiles, session) {
        const { name, email, phone, password } = payload;
        // file reqired 
        const { files } = payloadFiles;
        if (!files) throw new Error("User Photo is required");

        if (!name  || !password) {
            throw new Error('name, and password are required');
        }
        // if (phone.length !== 11) {
        //     throw new Error('Phone Number Must be 11 digits');
        // }
        if (password.length < 5) {
            throw new Error('Password must be at least 5 characters');
        }
        if (email) {
            const auth = await this.#repository.getAuthByEmail(email);
            if (auth) throw new Error('Email already exists');
        }
        if (phone) {
            const auth = await this.#repository.getAuthByPhone(phone);
            if (auth) throw new Error('Phone already exists');
        }
    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
      // console.log(payload, ":payload ", key, ":key");
    }
    console.log("Payload", payload);
        // const auth = await this.#repository.getAuthByPhone(phone);
        // if (auth) throw new Error('Phone already exists');
        const hashedPassword = await bcrypt.hash(String(password), 10);
        payload.password = hashedPassword;
        payload.userId = await idGenerate('USE-', "userId", this.#repository);
        // console.log("Payload", payload);
        // ll
        // role
        // const role = await this.#roleRepository.findAndCreateRole({ role: 'User' });
        // payload.roleRef = role._id;
        const authData = await this.#repository.authUserSingUp(payload, session);
        return authData;
    }

    async authUserSignIn(payload) {
        const { email, phone, password } = payload;
        console.log("AuthUser", payload);

        const auth = await this.#repository.getAuthByEmailOrPhone(email, phone);
        console.log("first auth", auth);
        if (!auth) throw new NotFoundError('unauthorized access');
        const isPasswordMatch = await bcrypt.compare(String(password), auth?.password);
        if (!isPasswordMatch) throw new NotFoundError('unauthorized access');
        const user_info_encrypted = {
            id: auth?._id || null,
            name: auth?.name || null,
            email: auth?.email || null,
            image: auth?.image || null,
        };

        const accessToken = generateAccessToken({ userInfo: { user_info_encrypted } });
        const refreshToken = generateRefreshToken({ userInfo: { user_info_encrypted } });

        return {
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
            user: user_info_encrypted,
        };
    }

    async authForgetPassword(payload, session) {
        const { email } = payload;
        if (!email) {
            throw new Error('email is required');
        }
        const auth = await this.#repository.getAuthByEmail(email);
        if (!auth) throw new NotFoundError('No user found');
        const OTP = await OTPGenerate()
        console.log('auth', auth);

        const stockAlertEmail = new Email({ email: auth?.email, name: auth?.name }, OTP);
        console.log('stockAlertEmail', stockAlertEmail);
        await stockAlertEmail.sendForgetPasswordOTP();
        await this.#repository.setUserOTP(auth?._id, OTP);
        return true;
    }

    async authForgetPasswordVarification(payload, session) {
        const { email, otp, password } = payload;
        if (!email || !otp || !password) {
            throw new Error('email, OTP and password are required');
        }
        const auth = await this.#repository.getAuthByEmail(email);
        if (!auth) throw new NotFoundError('No user found');
        // auth.otpTime 5min 
        if (auth.otpTime < Date.now() - 5 * 60 * 1000) throw new Error('OTP expired');
        if (otp != auth?.otp) throw new Error('Invalid OTP');
        const newPassword = await bcrypt.hash(String(password), 10);
        await this.#repository.updateUserPassword(auth?._id, newPassword);
        return true;
    }

    async getUserById(userId, session) {
        // 
        const user = await this.#repository.getUserById(userId, session);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    async getAllUser(payload) {
        const users = await this.#repository.getAllUser(payload);
        return users;
    }

    async getUserSearchByEmail(email, session) {
        // if (!email) throw new Error('Email is required');
        const user = await this.#repository.getAuthByEmail(email, session);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    async getSingleUser(id, session) {
        const user = await this.#repository.getUserById(id, session);
        if (!user) throw new NotFoundError('User not found');
        return user;
    }

    async updateUser(userId, payloadFiles, payload, session) {
        const { files } = payloadFiles;
        const user = await this.#repository.getUserById(userId, session);
        if (!user) throw new NotFoundError('User not found');
        let images;
        if (files?.length) {
            if (Array.isArray(files) && files.length > 0 && isMainThread) {
                // Map over the files and prepare them for upload
                const imgFile = files.map(({ buffer, originalname, fieldname, mimetype }) => ({
                    buffer,
                    originalname:
                        mimetype === "application/pdf"
                            ? convertFileNameWithPdfExt(originalname)
                            : convertFileNameWithWebpExt(originalname),
                    fieldname,
                    mimetype,
                }));


                // Handle the upload of each file
                for (let file of imgFile) {
                    try {
                        await uploadWorker(file);  // Assuming uploadWorker can handle one file at a time
                    } catch (error) {
                        console.error('Error uploading file:', error);
                        throw new Error('File upload failed');
                    }
                }

                // After upload, convert imgFile array to object format
                images = convertImgArrayToObject(imgFile);
            } else {
                throw new Error("Invalid or empty files array");
            }

            for (const key in images) {
                payload[key] = images[key];
            }
            //update by id 
        }

        const userData = await this.#repository.updateById(userId, payload);
        // Remove old file  
        if (files?.length) {
            await removeUploadFile(user.photo)
        }
        return userData;

    }

    async getDeleteUser(userId) {
        const user = await this.#repository.getUserById(userId);
        if (!user) throw new NotFoundError('User not found');
        const userData = await this.#repository.deleteById(userId);
        // Remove old file  
        if (userData && user.photo) {
            await removeUploadFile(user.photo)
        }
        return userData;
    }



}

module.exports = new AuthService(authRepository, 'auth');

