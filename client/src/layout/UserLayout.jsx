// layouts/UserLayout.jsx
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const UserLayout = ({ children }) => {
  return (
    <div className="user-layout-wrapper">
      <Header />
      <main className="user-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
