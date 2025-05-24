import ProfessionalRegistration from "./professional-registration/page";


const Page = ({ searchParams }: { searchParams: { token?: string } }) => {
  return <ProfessionalRegistration token={searchParams.token} />;
};

export default Page;
