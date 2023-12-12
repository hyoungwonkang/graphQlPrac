const { createClient } = require("@supabase/supabase-js");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const supabaseUrl = "";
const supabaseKey = "";
const supabase = createClient(supabaseUrl, supabaseKey);

const typeDefs = `#graphql
  type Member {
    no: String
    name: String
  }
`;


const resolvers = {
  Query: {
    members: async () => {
      let { data: members, error } = await supabase.from("member").select("*");
      return members;
    },
    member: async (_, { no }) => {
      let { data: members, error } = await supabase
        .from("member")
        .select("*")
        .eq("no", no);
      return members[0];
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (e) {
    console.log(e);
  }
  // `text` is not available here
})();