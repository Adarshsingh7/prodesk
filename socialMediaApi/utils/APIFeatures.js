class APIFeatures {
  constructor(query, queryString) {
    ((this.query = query), (this.queryString = queryString));
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    const sortBy = this.queryString.sort?.split(",").join(" ") || "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }
  fieldSelect() {
    const fields = this.queryString.fields?.split(",").join(" ") || "-__v";
    this.query = this.query.select(fields);
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
