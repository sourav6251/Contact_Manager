
import { PageWrapper } from "@/components/layout/PageWrapper";
import PagenationContect from "@/components/contact/PagenationContect";

const ContactManager = () => {
 
  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-tr from-[#89F7FEaa] to-[#66A6FFdd] dark:from-[#00B4D8] dark:to-[#0077B6] flex flex-col items-center p-4 transition-colors duration-300">
        <div className="w-full  mx-auto">
          <PagenationContect />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactManager;