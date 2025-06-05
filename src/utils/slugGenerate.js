const slugGenerate = (name) => {
  return name.trim().replace(/\s+/g, "-");
};

module.exports = slugGenerate;
