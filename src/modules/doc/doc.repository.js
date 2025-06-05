const { DocumentSchema } = require("../../models/index.js");
const { NotFoundError } = require("../../utils/errors.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class DocRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createDoc(payload) {
    const newDoc = await this.#model.create(payload);
    return newDoc;
  }

  async getAllDocByUser(payload) {
    const { owner } = payload;
    if (!owner) throw new Error("Owner is required");

    const docs = await this.#model.find({ owner }).sort({ createdAt: -1 }).populate("owner", "name email phone image")
    // .populate("author", "name email phone image");
    return docs;
  }

  async getShareDocWithPagination(payload) {
    const { page, limit, order, owner } = payload;
    if (!owner) throw new Error("Owner is required");

    try {
      const docs = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const docs = await this.#model
            .find({ "sharedWith.user": owner })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate("owner", "name email phone image")
            .populate("sharedWith.user", "name email phone image");

          const totalDoc = await this.#model.countDocuments({
            "sharedWith.user": owner,
          });

          return { doc: docs, totalDoc: totalDoc };
        }
      );

      return docs;
    } catch (error) {
      console.error("Error getting shared docs with pagination:", error);
      throw error;
    }
  }

  // async getDocWithPagination(payload) {
  //   try {
  //     const docs = await pagination(
  //       payload,
  //       async (limit, offset, sortOrder) => {
  //         const docs = await this.#model
  //           .find({})
  //           .sort({ createdAt: sortOrder })
  //           .skip(offset)
  //           .limit(limit);
  //         // .populate('')
  //         // .populate('')
  //         const totalDoc = await this.#model.countDocuments();

  //         return { doc: docs, totalDoc: totalDoc };
  //       }
  //     );

  //     return docs;
  //   } catch (error) {
  //     console.error("Error getting docs with pagination:", error);
  //     throw error;
  //   }
  // }

  async getSingleDoc(payload) {
    const { id, owner } = payload;
    console.log("id", id);
    if (!id) throw new Error("ID is required");
// find id to doc and owner check is curret and owner is match sharedWith user than valide to doc 
  const docData = await this.#model
    .findOne({
      _id: id,
      $or: [
        { owner },
        { "sharedWith.user": owner }
      ]
    })
    .populate("owner", "name email phone image")
    .populate("sharedWith.user", "name email phone image");
    
    if (!docData) throw new NotFoundError("Doc Not Find");
    return docData;
  }
}

module.exports = new DocRepository(DocumentSchema);
