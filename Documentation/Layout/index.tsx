// Nextra
import { Layout } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";

// Layout
import Header from "@/Layout/Header";
import Banner from "@/Layout/Header/Banner";
import Search from "@/Layout/Header/Search";
import Footer from "@/Layout/Footer";

// Styles
import "nextra-theme-docs/style.css";

// Types
import { ReactNode } from "react";

// =====================================================================================================================

const LayoutComponent = async ({ children }: { children: ReactNode }) => {
  return (
    <Layout
      banner={<Banner />}
      navbar={<Header />}
      pageMap={await getPageMap()}
      footer={<Footer />}
      search={<Search />}
      editLink={null}
      sidebar={{
        autoCollapse: true,
        defaultMenuCollapseLevel: 1,
      }}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      feedback={{ content: null }}
      darkMode={true}
      // ... Your additional layout options
    >
      {children}
    </Layout>
  );
};

export default LayoutComponent;
