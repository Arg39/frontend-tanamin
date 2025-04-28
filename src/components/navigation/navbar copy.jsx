import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../icon/icon-heroicons";
import { categories } from "../../routes/categories";
import "../../css/navigation.css";

const Navbar = ({ page, userName, isLogin }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      if (!isDropdownHovered) {
        setIsDropdownOpen(false);
      }
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsDropdownHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownHovered(false);
    setIsDropdownOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md flex items-center fixed top-0 w-full z-50 px-2 lg:px-52 text-xl py-2 lg:py-0">
        <div className="flex w-full">
          <img
            src="assets/Logo-CodeLearn.png"
            alt="Logo"
            className="ml-1 lg:ml-0 h-8 lg:h-16"
          />
          <div className="w-full flex items-center justify-end lg:hidden">
            <button>
              <Icon type={"bars-3"} className={"size-8"} />
            </button>
          </div>
        </div>

        <ul className="hidden lg:flex w-full justify-start space-x-8">
          <li
            className={`flex justify-center items-center hover:text-amber-700 cursor-pointer py-6 font-semibold ${
              page === "beranda"
                ? " border-b-[3px] border-b-amber-700 text-amber-700 text-brown border-brown"
                : ""
            }`}
          >
            <Link
              to="/"
              className="flex justify-center items-center hover:text-amber-700 cursor-pointer"
            >
              Beranda
            </Link>
          </li>
          <li
            className={`flex justify-center items-center hover:text-amber-700 cursor-pointer font-semibold ${
              page === "/tentang"
                ? "w-full border-b-[3px] border-b-amber-700 text-amber-700"
                : ""
            }`}
          >
            <Link
              to="/tentang"
              className="flex justify-center items-center hover:text-amber-700 cursor-pointer"
            >
              Tentang
            </Link>
          </li>
          <li
            className="relative group flex justify-center items-center cursor-pointer font-semibold"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="flex items-center cursor-pointer">
              Kategori{" "}
              {<Icon className={"size-4 flex mt-1 ml-1"} type={"dropdown"} />}
            </span>
            <div
              className={`absolute top-full left-0 ${
                isDropdownOpen ? "block" : "hidden"
              } flex justify-center bg-white shadow-lg mt-2 p-4 w-96 py-8`}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <div className="grid grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/kategori/${category.href}`}
                    className="hover:text-amber-700 cursor-pointer break-words overflow-hidden"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li
            className={`flex justify-center items-center hover:text-amber-700 cursor-pointer ${
              page === "/faq"
                ? "w-full border-b-[3px] border-b-amber-700 text-amber-700"
                : ""
            }`}
          >
            <Link
              to="/faq"
              className="flex justify-center items-center hover:text-amber-700 cursor-pointer font-semibold"
            >
              FAQ
            </Link>
          </li>
          <li
            className={`flex justify-center items-center hover:text-amber-700 cursor-pointer ${
              page === "/kontak"
                ? "w-full border-b-[3px] border-b-amber-700 text-amber-700"
                : ""
            }`}
          >
            <Link
              to="/kontak"
              className="flex justify-center items-center hover:text-amber-700 cursor-pointer font-semibold"
            >
              Kontak Kami
            </Link>
          </li>
        </ul>
        <div className="user-actions hidden lg:flex justify-start items-center space-x-8">
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
              <div className="w-px h-6 bg-gray-300"></div>
              <i className="icon-user">
                <Icon type={"user"} />
              </i>
              <span className="font-medium">Halo, {userName}</span>
            </>
          ) : (
            <>
              {page === "login" ? (
                <Link
                  to="/daftar"
                  className="py-1 px-8 rounded-full text-lg font-medium bg-amber-700 text-white"
                >
                  Daftar
                </Link>
              ) : page === "daftar" ? (
                <Link
                  to="/login"
                  className="py-1 px-8 rounded-full text-lg font-medium bg-amber-700 text-white"
                >
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/daftar"
                    className="py-1 px-8 rounded-full text-lg font-medium bg-amber-700 text-white"
                  >
                    Daftar
                  </Link>
                  <Link
                    to="/login"
                    className="py-1 px-8 rounded-full text-lg font-medium bg-amber-700 text-white"
                  >
                    Login
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-50 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <button className="mb-4" onClick={toggleSidebar}>
            <Icon type="x" />
          </button>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block py-2 px-4 rounded ${
                  page === "beranda" ? "bg-gray-200" : ""
                }`}
                onClick={toggleSidebar}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/tentang"
                className={`block py-2 px-4 rounded ${
                  page === "/tentang" ? "bg-gray-200" : ""
                }`}
                onClick={toggleSidebar}
              >
                Tentang
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={`block py-2 px-4 rounded ${
                  page === "/faq" ? "bg-gray-200" : ""
                }`}
                onClick={toggleSidebar}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/kontak"
                className={`block py-2 px-4 rounded ${
                  page === "/kontak" ? "bg-gray-200" : ""
                }`}
                onClick={toggleSidebar}
              >
                Kontak Kami
              </Link>
            </li>
            <li>
              <div className="relative">
                <button
                  className="block py-2 px-4 rounded w-full text-left"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Kategori
                  <Icon
                    className={`ml-2 transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    type={"dropdown"}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/kategori/${category.href}`}
                        className="block py-2 px-4 hover:bg-gray-200"
                        onClick={toggleSidebar}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          </ul>
          <div className="mt-8">
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
                <div className="w-px h-6 bg-gray-300"></div>
                <i className="icon-user">
                  <Icon type={"user"} />
                </i>
                <span className="font-medium">Halo, {userName}</span>
              </>
            ) : (
              <>
                <Link
                  to="/daftar"
                  className="block py-2 px-4 rounded-full text-lg font-medium bg-amber-700 text-white mb-2"
                  onClick={toggleSidebar}
                >
                  Daftar
                </Link>
                <Link
                  to="/login"
                  className="block py-2 px-4 rounded-full text-lg font-medium bg-amber-700 text-white"
                  onClick={toggleSidebar}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
