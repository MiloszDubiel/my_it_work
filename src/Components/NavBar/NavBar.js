import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { MdOutlineAccountCircle } from "react-icons/md";
import Button from "react-bootstrap/Button";

const NavBar = () => {
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      fixed="top"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand>
          <Link to="/" style={{ textDecoration: "none" }}>
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
            <Form.Control
              type="search"
              placeholder="Szukaj ofert IT"
              className="me-2"
              aria-label="Search"
              style={{ width: "250px" }}
            />
            <div className={styles.profile}>
              <MdOutlineAccountCircle style={{ color: "white" }} />
            </div>
            <Card className={styles.card}>
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
