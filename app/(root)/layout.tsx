import { Header } from "@/components/header";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>
    <Header />
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-80px)]">
    {children}
    </div>
  </div>;
};

export default PageLayout;
