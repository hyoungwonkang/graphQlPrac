const { createClient } = require("@supabase/supabase-js");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const supabaseUrl = "https://qgtftoooyicbxovvmquq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGZ0b29veWljYnhvdnZtcXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI0NjY5MDEsImV4cCI6MjAxODA0MjkwMX0.k1mxCrC86qrlG7f2L7M95iAW87pOBDIhsb1s0Y6_SqM";
const supabase = createClient(supabaseUrl, supabaseKey);

const typeDefs = `#graphql
  type Member {
    id: Int
    no: String
    name: String
  }
  type Query {
    members: [Member]
    member(no: String): Member
  }
`;


const resolvers = {
  Query: {
    members: async () => {
      let { data: members, error } = await supabase.from("members").select("*");
      return members;
    },
    member: async (_, { no }) => {
      let { data: members, error } = await supabase
        .from("members")
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