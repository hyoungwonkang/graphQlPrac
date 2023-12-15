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
    role: Role
    jobTitle: JobTitle

    role_id: Int # 직군(FK)
    profile_img: String # 프로필 이미지 URL
    gender: String # 성별(M/F/X)
    birthday: String # 생일
    job_start_year: String # 연차
    joined_year: String # 근속년수
    
    job_title_id: Int # 직책(FK)
    # 부서는 일단 제외(복잡해짐)
  }
  type Role {
    id: Int # PK
    name: String # 직군(이름)
  }
  type JobTitle {
    id: Int # PK
    name: String # 직책(이름)
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
  Member: {
    role: async ({ role_id }) => {
      let {data: roles, error} = await supabase.from("roles").select("*").eq("id", role_id);
      return roles[0];
    },
    jobTitle: async ({ job_title_id }) => {
      let {data: jobTitles, error} = await supabase.from("jobTitles").select("*").eq("id", job_title_id);
      return jobTitles[0];
    }
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
})();