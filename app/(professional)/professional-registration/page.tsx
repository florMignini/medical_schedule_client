import ProfessionalRegistration from "./ProfessionalRegistration";

const Page = ({ searchParams }: { searchParams: { token?: string } }) => {
  return <ProfessionalRegistration token={searchParams.token} />;
};

export default Page;
