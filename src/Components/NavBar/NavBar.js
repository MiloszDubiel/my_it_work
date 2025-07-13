import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import Card from "react-bootstrap/Card";
import { MdOutlineAccountCircle } from "react-icons/md";
import Button from "react-bootstrap/Button";
import { useRef } from "react";

const NavBar = () => {
  let card = useRef(null);

  return (
    <Navbar expand="lg" style={{height: '70px'}} className={styles.navBar} fixed="top">
      <Container fluid>
        <Navbar.Brand>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: "20px",
              color: "white",
            }}
          >
            MyITWork
          </Link>
        </Navbar.Brand>
        <Navbar.Brand className={styles.search}>
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>

          <Form className="d-flex">
            <Nav.Link href="#action2"></Nav.Link>
            <div className={styles.add}>Dodaj ogłoszenie</div>
            <input
              type="search"
              placeholder="Szukaj ofert IT"
              className={styles.searchField}
              aria-label="Search"
              style={{ width: "250px" }}
            />
            <div className={styles.profile}>
              <MdOutlineAccountCircle
                style={{ color: "white" }}
                onClick={() => {
                  card.current.classList.toggle(styles.cardShow);
                }}
              />
            </div>
            <Card className={styles.card + " " + styles.cardShow} ref={card}>
              <Card.Body style={{ width: "100%" }}>
                <Button
                  style={{ width: "100%", borderRadius: "20px" }}
                  variant="primary"
                >
                  Zarejestruj się
                </Button>
              </Card.Body>
              <Card.Body
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <p style={{ paddingTop: "18px" }}>Masz już konto ?</p>
                <Button
                  style={{ width: "40%", borderRadius: "20px" }}
                  variant="success"
                >
                  Zaloguj się
                </Button>
              </Card.Body>
            </Card>
          </Form>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavBar;
