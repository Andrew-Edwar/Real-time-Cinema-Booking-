module.exports = mongoose => {

  var schema = mongoose.Schema(
    {
      CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      MovieID: { type: mongoose.Schema.Types.ObjectId, ref: 'tutorial' },
      vendorID:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      ShowTime: [
        {
          date: String,
          hours: String,
          endTime: String,
          selectedSeats: { type: [Number], default: [] },
          cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'cinema' }
        }
      ],
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