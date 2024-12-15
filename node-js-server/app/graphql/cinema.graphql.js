const { GraphQLObjectType, GraphQLString,GraphQLFloat, GraphQLList, GraphQLSchema, GraphQLInputObjectType, GraphQLNonNull } = require('graphql');
const db = require("../models");
const Cinema = db.Cinemas;

// Define CinemaType
const CinemaType = new GraphQLObjectType({
  name: 'Cinema',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    vendorID: { type: GraphQLString },
    locations: { 
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'Location',
          fields: {
            latitude: { type: GraphQLFloat },
            longitude: { type: GraphQLFloat }
          }
        })
      )
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cinemas: {
      type: new GraphQLList(CinemaType),
      resolve() {
        return Cinema.find().then(cinemas => 
          cinemas.map(cinema => ({
            ...cinema.toJSON(),
            id: cinema._id.toString(),
          }))
        );
      }
      
    },
  }
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCinema: {
      type: CinemaType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        vendorID: { type: new GraphQLNonNull(GraphQLString) },
        locations: { 
          type: new GraphQLList(
            new GraphQLInputObjectType({
              name: 'LocationInput',
              fields: {
                latitude: { type: GraphQLFloat },
                longitude: { type: GraphQLFloat }
              }
            })
          )
        },
      },
      resolve(parent, args) {
        const cinema = new Cinema({
          name: args.name || '',
          vendorID: args.vendorID,
          locations: args.locations || [],
        });

        return cinema.save().then(savedCinema => {
            // Explicitly map _id to id
            return {
              ...savedCinema.toJSON(),
              id: savedCinema._id.toString(),
            };
          }).catch(err => {
            throw new Error("Failed to add cinema: " + err.message);
          });
      }
    },
  }
});

// Export schema
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
