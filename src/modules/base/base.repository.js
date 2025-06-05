class BaseRepository {
  #model;
  constructor(model) {
    this.#model = model;
  }

  async create(item, session) {
    return await this.#model.create([item], { session });
  }

  async findAll(filter = {}, populateFields = [], excludeFields = {}) {
    console.log("this.#model", this.#model);
    let query = this.#model.find(filter).sort({ createdAt: -1 });

    // Apply global field exclusion if specified
    if (excludeFields.global) {
      query = query.select(excludeFields.global); // Exclude fields globally
    }

    // Apply population with field exclusion if fields are specified
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        const options = excludeFields[field]
          ? { select: excludeFields[field] }
          : {};
        query = query.populate({ path: field, ...options });
      });
    }

    const results = await query;
    return results;
  }

  async findOne(filter = {}, populateFields = [], excludeFields = {}) {
    let query = this.#model.findOne(filter);

    // Apply population with field exclusion if fields are specified
    if (populateFields.length > 0) {
      populateFields.forEach((field) => {
        const options = excludeFields[field]
          ? { select: excludeFields[field] }
          : {};
        query = query.populate({ path: field, ...options });
      });
    }

    const results = await query;
    return results;
  }

  async findOneByIdentifyer(identifyer) {
    const results = await this.#model.find()
      .sort({ [identifyer]: -1 })
      .select(identifyer)
      .limit(1);
    
    return results.length ? results[0][identifyer] : null;
  }
  

  async findById(id, populateFields = [], selectedFields = null) {
    let query = this.#model.findById(id);
    if (populateFields.length > 0) {
        populateFields.forEach((field) => {
            query = query.populate(field);
        });
    }
    if (selectedFields) {
        query = query.select(selectedFields);
    }

    const results = await query;
    return results;
}

async findBySlug(slug, populateFields = [], selectedFields = null) {
  let query = this.#model.findOne({ slug });
  if (populateFields.length > 0) {
      populateFields.forEach((field) => {
          query = query.populate(field);
      });
  }
  if (selectedFields) {
      query = query.select(selectedFields);
  }

  const results = await query;
  return results;
}



  async updateById(id, updatedData, session) {
    const options = session ? { session } : {  };
    return await this.#model.findByIdAndUpdate(
      id,
      { $set: updatedData },
      options
    );
  }
  // await updateById("someId", { name: "New Name" }, session, true);
  // await updateById("someId", { $push: { tags: "newTag" } }, session, false);
// Equivalent to { $push: { tags: "newTag" } }

// Equivalent to { $set: { name: "New Name" } }
// 
  // async updateById(id, updatedData, session, useSet = true) {
  //   const options = session ? { session, new: true } : { new: true };
  
  //   return await this.#model.findByIdAndUpdate(
  //     id,
  //     useSet ? { $set: updatedData } : updatedData, // Choose between $set or raw update
  //     options
  //   );
  // }
  


  async deleteById(id, session) {
    return await this.#model.findByIdAndDelete(id, { session });
  }
  
  async updateStatus(id, status) {
    return await this.#model.findByIdAndUpdate(
      id,
      { status: status.status },
      { new: true }
    );
  }
}

module.exports = BaseRepository;
