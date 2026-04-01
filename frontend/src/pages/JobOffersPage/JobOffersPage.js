import { useState, useMemo } from "react";
import axios from "axios";
import styles from "./JobOffersPage.module.css";
import Navbar from "../../components/ui/NavBar/NavBar";
import Filter from "../../components/layout/Filter/Filter";
import LoadingComponent from "../../components/ui/Loading/LoadingComponent";
import Offer from "../../components/layout/Offert/Offer";
import Pagination from "../../components/ui/Pagination/Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const JobOffersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [_, setSort] = useState(searchParams.get("sort") || "");
  const [info, setInfo] = useState("");
  const offersPerPage = 9;
  const navigate = useNavigate();

  const allParams = Object.fromEntries(searchParams.entries());
  const { page, sort, ...filters } = allParams;

  const currentPage = Number(page || 1);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/job-offerts?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token")}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error("Błąd podczas pobierania ofert:", err);
    }
  };

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers", filters, page, sort],
    queryFn: fetchOffers,
  });

  const sortedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      switch (sort) {
        case "title-a-z": {
          const nameA = a.title?.toUpperCase() || "";
          const nameB = b.title?.toUpperCase() || "";
          return nameA.localeCompare(nameB);
        }

        case "title-z-a": {
          const nameA = a.title?.toUpperCase() || "";
          const nameB = b.title?.toUpperCase() || "";
          return nameB.localeCompare(nameA);
        }

        case "name-a-z": {
          const nameA = a.companyName?.toUpperCase() || "";
          const nameB = b.companyName?.toUpperCase() || "";
          return nameA.localeCompare(nameB);
        }

        case "name-z-a": {
          const nameA = a.companyName?.toUpperCase() || "";
          const nameB = b.companyName?.toUpperCase() || "";
          return nameB.localeCompare(nameA);
        }

        case "newest": {
          const toDate = (str) => {
            if (!str) return Infinity;
            const [dd, mm, yyyy] = str.split(".");
            return new Date(`${yyyy}-${mm}-${dd}`).getTime();
          };
          return toDate(b.active_to) - toDate(a.active_to);
        }

        case "oldest": {
          const toDate = (str) => {
            if (!str) return Infinity;
            const [dd, mm, yyyy] = str.split(".");
            return new Date(`${yyyy}-${mm}-${dd}`).getTime();
          };
          return toDate(a.active_to) - toDate(b.active_to);
        }

        default:
          return 0;
      }
    });
  }, [offers, sort]);

  const totalPages = Math.ceil(sortedOffers.length / offersPerPage);
  const startIndex = (currentPage - 1) * offersPerPage;
  const endIndex = startIndex + offersPerPage;
  const currentOffers = sortedOffers.slice(startIndex, endIndex);

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
    setSort(value);
  };

  return (
    <>
      <Navbar />
      <Filter offersPage={true} />
      <div className={styles.container}>
        <h1>Oferty pracy</h1>

        <div className={styles.offersList}>
          <div className={styles.wrapper}>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                onChange={(e) => handleSortChange(e.target.value)}
                value={sort}
              >
                <option value="default" defaultValue="default">
                  Domyślnie
                </option>

                <option value="title-a-z">Tytuł oferty A-Z</option>
                <option value="title-z-a">Tytuł oferty Z-A</option>

                <option value="name-a-z">Nazwa firmy A-Z</option>
                <option value="name-z-a">Nazwa firmy Z-A</option>

                <option value="newest">Najdłuższa ważność</option>
                <option value="oldest">Najbliższa data wygaśnięcia</option>
              </select>
              <span className={styles.chev} aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          {currentOffers.length > 0
            ? currentOffers.map((offer, index) => <Offer offer={offer} />)
            : isLoading && <LoadingComponent />}
          {info && <p className={styles.noOffers}>{info}</p>}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams);

            params.set("page", page.toString());

            navigate(`?${params.toString()}`);
          }}
        />
      </div>
    </>
  );
};

export default JobOffersPage;
