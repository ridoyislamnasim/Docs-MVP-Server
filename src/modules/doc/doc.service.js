const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const docRepository = require("./doc.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const authRepository = require("../auth/auth.repository.js");

class DocService extends BaseService {
  #repository;
  #authRepository;
  constructor(repository, authRepository ,serviceName) {
    super(repository,authRepository , serviceName);
    this.#repository = repository;
    this.#authRepository = authRepository;
  }

  async createDoc(payload, session) {
    const { title, owner } = payload;
    if (!title) throw new Error("Title and owner are required");

    const docData = await this.#repository.createDoc(payload);
    return docData;
  }

  async getAllDocByUser(payload) {
    const { owner } = payload;
    return await this.#repository.getAllDocByUser(payload);
  }

  async getShareDocWithPagination(payload) {
    const { page, limit, order, owner } = payload;
    if (!owner) throw new Error("Owner is required");

    const docs = await this.#repository.getShareDocWithPagination(payload);
    return docs;
  }

  async getDocWithPagination(payload) {
    const doc = await this.#repository.getDocWithPagination(payload);
    return doc;
  }

  async getSingleDoc(payload) {
    const docData = await this.#repository.getSingleDoc(payload);
    if (!docData) throw new NotFoundError("Doc Not Find");
    return docData;
  }

  async updateDoc(id, payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { title, details, tagRef, author, status } = payload;

    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    console.log("docData ---", payload);

    const docData = await this.#repository.updateById(id, payload);
    console.log("docData", docData);
    if (!docData) throw new NotFoundError("Doc Not Find");

    if (files?.length && docData?.images) {
      await removeUploadFile(docData?.images);
    }
    return docData;
  }

  async shareDoc(id, payload, session) {
    const { email, role, userId } = payload;
    if (!email) throw new Error("User ID is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!role || !["viewer", "editor"].includes(role)) {
      throw new Error("Role must be either 'viewer' or 'editor'");
    }

        // check email is  exist in the system db user collection
    const user = await this.#authRepository.getAuthByEmail(email);
    if (!user) {
      throw new Error("User with this email does not exist");
    }


    const doc = await this.#repository.findById(id, ["sharedWith.user", 'owner']);
    if (!doc) throw new NotFoundError("Doc not found");
    if (doc.owner.email == email) {
      throw new Error("You cannot share a document with yourself");
    }
    const sharedWith = doc.sharedWith || [];
    const existingShare = sharedWith.find((share) => share.user.email === email);
    if (existingShare) {
      existingShare.role = role; // Update role if already shared
    } else {
      sharedWith.push({ user: user?._id, role }); // Add new share
    }
    doc.sharedWith = sharedWith;
    console.log("doc", doc);
    const updatedDoc = await this.#repository.updateById(id, doc, session);
    if (!updatedDoc) throw new NotFoundError("Doc not found after sharing");
    return updatedDoc;
  }

  async deleteDoc(id) {
    const doc = await this.#repository.findById(id);
    if (!doc) throw new NotFoundError("Doc not found");
    const deletedDoc = await this.#repository.deleteById(id);
    // if (deletedDoc) {
    //   await removeUploadFile(doc?.image);
    // }
    return deletedDoc;
  }
}

module.exports = new DocService(docRepository,authRepository , "doc");
