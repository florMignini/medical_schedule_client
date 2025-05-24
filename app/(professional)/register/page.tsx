import ProfessionalRegistration from "./professional-registration/page";


const Page = ({ searchParams }: { searchParams: { token?: string } }) => {
  console.log("Search Params:", searchParams);
  return <ProfessionalRegistration token={searchParams.token} />;
};

export default Page;
