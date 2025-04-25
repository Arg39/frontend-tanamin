import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../icon-heroicons";
import { categories } from "../../routes/categories";

const Sidebar = ({ page, userName, isLogin }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Icon type="menu" />
      </button>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleSidebar}>
            <Icon type="x" />
          </button>
        </div>
        <ul className="sidebar-links">
          <li className={page === "beranda" ? "active" : ""}>
            <Link to="/" onClick={toggleSidebar}>
              Beranda
            </Link>
          </li>
          <li className={page === "/tentang" ? "active" : ""}>
            <Link to="/tentang" onClick={toggleSidebar}>
              Tentang
            </Link>
          </li>
          <li className="dropdown">
            <span>Kategori</span>
            <ul className="dropdown-menu">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={`/kategori/${category.href}`}
                    onClick={toggleSidebar}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className={page === "/faq" ? "active" : ""}>
            <Link to="/faq" onClick={toggleSidebar}>
              FAQ
            </Link>
          </li>
          <li className={page === "/kontak" ? "active" : ""}>
            <Link to="/kontak" onClick={toggleSidebar}>
              Kontak Kami
            </Link>
          </li>
        </ul>
        <div className="user-actions">
          {isLogin ? (
            <>
              <i className="bell">
                <Icon type={"bell-alert"} />
              </i>
              <i className="icon-chart">
                <Icon type={"archive-box"} />
              </i>
              <i className="icon-search">
                <Icon type={"magnifying-glass"} />
              </i>
              <i className="icon-user">
                <Icon type={"user"} />
              </i>
              <span>Halo, {userName}</span>
            </>
          ) : (
            <>
              <Link className="btn" to="/daftar" onClick={toggleSidebar}>
                Daftar
              </Link>
              <Link className="btn" to="/login" onClick={toggleSidebar}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
