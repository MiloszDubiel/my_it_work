import "./navbar-style.css";
import { IoMenuSharp } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdFavoriteBorder } from "react-icons/md";
const Navbar = () => {

  return (
    <nav>
      <ul class="menu">
        <li title="home">
          <a href="#" class="menu-button">
            <IoMenuSharp className="icon black" />
          </a>
        </li>

        <li title="search">
          <a href="#">
            <IoSearchSharp className="icon black" />
          </a>
        </li>
        <li title="add">
          <a href="#">
            {" "}
            <IoMdAdd className="icon black" />
          </a>
        </li>
        <li title="favorite">
          <a href="#">
            <MdFavoriteBorder className="icon black" />
          </a>
        </li>
        <li title="account">
          <a href="#">
            <MdOutlineAccountCircle className="icon black" />
          </a>
        </li>
      </ul>

      <ul class="menu-bar">
        <li>Menu</li>
        <li>Szukaj</li>
        <li>Dodaj</li>
        <li>Ulubione</li>
        <li>Konto</li>
      </ul>
    </nav>
  );
};
export default Navbar;
