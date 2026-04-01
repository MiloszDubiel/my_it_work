import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-orange-100 border-gray-200 cursor-pointer"
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPage) <= 2,
        )
        .map((page, index, arr) => {
          const prevPage = arr[index - 1];
          return (
            <div key={page} className="flex items-center">
              {prevPage && page - prevPage > 1 && (
                <span className="px-2 ">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded border transition border-gray-200 cursor-pointer ${
                  currentPage === page
                    ? "bg-orange-500 text-white border-orange-500"
                    : "hover:bg-orange-100"
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-orange-100 border-gray-200 cursor-pointer"
      >
        →
      </button>
    </div>
  );
};
export default Pagination;
