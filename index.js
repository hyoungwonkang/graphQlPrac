const { createClient } = require("@supabase/supabase-js");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const supabaseUrl = "https://gycenfuqfnnoghsdoqan.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y2VuZnVxZm5ub2doc2RvcWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI3OTc3NzMsImV4cCI6MjAxODM3Mzc3M30.UacJypd81yQNYDvlAyk-eaSB4Hz8gB76iDapR-ebWyw";
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

  input filteredMemberQueryInput {
    gender: String
    name: String
  }

  type Query {
    members: [Member]
    member(no: String): Member
    filteredMembers(filteredMemberInfo:filteredMemberQueryInput):[Member]
  }
`;


const resolvers = {
  Query: {
    members: async () => {
      let { data: members, error } = await supabase.from("Member").select("*");
      return members;
    },
    member: async (_parent, { no }, context, info) => {
      let { data: members, error } = await supabase
        .from("Member")
        .select("*")
        .eq("no", no);
      return members[0];
    },
    filteredMembers: async (_parent, args) => {
      let query;
      const filterInfo = args.filteredMemberInfo;
      for (const key in filterInfo) {
        query = supabase.from("Member").select("*").eq(key, filterInfo[key]);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  },
  Member: {
    role: async ({ role_id }, context, info) => {
      let {data: roles, error} = await supabase.from("roles").select("*").eq("id", role_id);
      return roles[0];
    },
    jobTitle: async ({job_title_id}, context, info) => {
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