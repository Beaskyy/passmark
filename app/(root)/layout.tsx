import { Header } from "@/components/header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>
    <Header />
    <div className="lg:px-[108px] md:px-[20] px-5 bg-[#FAFAFA] min-h-[calc(100vh-80px)]">
    {children}
    </div>
  </div>;
};

export default PageLayout;
