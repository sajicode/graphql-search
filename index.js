import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLUnionType,
  GraphQLList
} from "graphql";

const DATA = [
  { username: "catherine" },
  { director: "catherine haywire" },
  { author: "catherine clarkson" }
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    username: {
      type: GraphQLString
    }
  }
});

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: {
    director: {
      type: GraphQLString
    }
  }
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: {
    author: {
      type: GraphQLString
    }
  }
});

const SearchType = new GraphQLUnionType({
  name: "SearchType",
  types: [UserType, MovieType, BookType],
  resolveType(data) {
    if (data.username) {
      return UserType;
    }

    if (data.director) {
      return MovieType;
    }

    if (data.author) {
      return BookType;
    }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      search: {
        type: new GraphQLList(SearchType),
        args: {
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, { text }) {
          return DATA.filter(person => {
            const searchableProp =
              person.username || person.director || person.author;
            return searchableProp.indexOf(text) !== -1;
          });
        }
      }
    }
  })
});

const query = `
  {
    search(text: "clark") {
      ... on User {
        username
      }

      ... on Movie {
        director
      }

      ... on Book {
        author
      }
    }
  }
`;

graphql(schema, query).then(result => {
  console.log(JSON.stringify(result, null, 2));
});
