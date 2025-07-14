import "./navbar-style.css";
import { GoHome } from "react-icons/go";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";

const toggleShow = (el) => {
  [...document.querySelectorAll(".menu-bar li")]
    .at(el)
    .classList.toggle("hidden");
};

const Navbar = () => {
  return (
    <nav>
      <ul class="menu">
        <li
          title="home"
          onMouseOver={() => {
            toggleShow(0);
          }}
          onMouseOut={() => {
            toggleShow(0);
          }}
        >
          <a href="#" class="menu-button">
            <GoHome className="icon black" />
          </a>
        </li>

        <li
          title="search"
          onMouseOver={() => {
            toggleShow(1);
          }}
          onMouseOut={() => {
            toggleShow(1);
          }}
        >
          <a href="#">
            <IoSearchSharp className="icon black" />
          </a>
        </li>
        <li
          title="add"
          onMouseOver={() => {
            toggleShow(2);
          }}
          onMouseOut={() => {
            toggleShow(2);
          }}
        >
          <a href="#">
            {" "}
            <IoMdAdd className="icon black" />
          </a>
        </li>
        <li
          title="favorite"
          onMouseOver={() => {
            toggleShow(3);
          }}
          onMouseOut={() => {
            toggleShow(3);
          }}
        >
          <a href="#">
            <MdFavoriteBorder className="icon black" />
          </a>
        </li>
        <li
          title="account"
          onMouseOver={() => {
            toggleShow(4);
          }}
          onMouseOut={() => {
            toggleShow(4);
          }}
        >
          <a href="#">
            <MdOutlineAccountCircle className="icon black" />
          </a>
        </li>
      </ul>

      <ul class="menu-bar">
        <li className="hidden">Strona główna</li>
        <li className="hidden">Szukaj</li>
        <li className="hidden">Dodaj</li>
        <li className="hidden">Ulubione</li>
        <li className="hidden">Konto</li>
      </ul>
    </nav>
  );
};
export default Navbar;
