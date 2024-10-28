import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLSchema } from 'graphql';
import docs from '../docs.mjs';
import { ObjectId } from 'mongodb';

// Define the Document type with a proper name
const DocumentType = new GraphQLObjectType({
  name: 'Document',
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  }
});

// Define the Root Query type with a proper name
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    document: {
      type: DocumentType,
      args: { _id: { type: GraphQLID } },
      resolve: async (parent, args) => {
        if (!ObjectId.isValid(args._id)) {
          throw new Error("Invalid ObjectId");
        }
        return await docs.getOne(args._id);
      }
    },
    documents: {
      type: new GraphQLList(DocumentType),
      resolve: async () => {
        return await docs.getAll();
      }
    }
  }
});

// Define the Root Mutation type with a proper name
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDocument: {
      type: DocumentType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const result = await docs.addOne(args);
        return { _id: result.insertedId, ...args };
      }
    },
    updateDocument: {
      type: DocumentType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString }
      },
      resolve: async (parent, args) => {
        if (!ObjectId.isValid(args._id)) {
          throw new Error("Invalid ObjectId");
        }

        const result = await docs.updateOne(args._id, { title: args.title, content: args.content });
        if (result.modifiedCount > 0) {
          return { _id: args._id, title: args.title, content: args.content };
        }
        throw new Error("Document not found or no changes made");
      }
    },
    deleteDocument: {
      type: DocumentType,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: async (parent, args) => {
        if (!ObjectId.isValid(args._id)) {
          throw new Error("Invalid ObjectId");
        }

        const result = await docs.deleteOne(args._id);
        if (result.deletedCount > 0) {
          return { _id: args._id };
        }
        throw new Error("Document not found");
      }
    }
  }
});

// Export the schema
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationType
});

export default schema;
