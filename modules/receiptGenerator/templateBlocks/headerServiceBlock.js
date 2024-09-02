const headerServiceBlock = (data) => {
  return !Array.isArray(data) || !data.length
    ? []
    : [
        { type: "ruler" },
        {
          type: "smartProperties",
          lines: data.map(({ name, value }) => ({
            name,
            value: value.toString(),
          })),
        },
      ];
};

export default headerServiceBlock;
