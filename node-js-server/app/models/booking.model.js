module.exports = mongoose => {

  var schema = mongoose.Schema(
    {
      cinemaID: { type: mongoose.Schema.Types.ObjectId, ref: 'cinema' },
      CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      MovieID: { type: mongoose.Schema.Types.ObjectId, ref: 'tutorial' },
      vendorID:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      ShowTime:
        {
          date: String , // change the type and default value to string
          hours: String,
          endTime: String, 
          selectedSeats: { type: [Number], default: [] }
        },
     // Array to store selected seat indices
        selectedMovieIndex: { type: Number },  // Index of the selected movie
        selectedMovieValue: { type: String } 
    },
    { timestamps: true }
  );


  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });


  const Booking = mongoose.model("booking", schema);
  return Booking;
};