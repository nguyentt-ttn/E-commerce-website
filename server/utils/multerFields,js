const generateVariantFields = (maxVariants = 10) => {
  const fields = [{ name: "images", maxCount: 10 }];
  for (let i = 0; i < maxVariants; i++) {
    fields.push({ name: `variants[${i}][image]`, maxCount: 1 });
  }
  return fields;
};

module.exports = { generateVariantFields };
