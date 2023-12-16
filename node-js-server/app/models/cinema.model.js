module.exports = mongoose => {

  var schema = mongoose.Schema(
    {
      id:Number,
      name: String, 
      vendorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      locations: [
        {
          latitude: Number,
          longitude: Number,
        },
      ],
    },
    { timestamps: true }
  );


  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


  const Cinema = mongoose.model("cinema", schema);
  return Cinema;
};