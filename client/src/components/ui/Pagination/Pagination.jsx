import React from 'react';
import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination" aria-label="Pagination">
            {Array.from({ length: totalPages }, (_, index) => { //create an array of length totalPages and map over it to create buttons for each page
                const page = index + 1;

                return (
                    <button
                        key={page}
                        type="button"
                        className={page === currentPage ? 'pagination__button pagination__button--active' : 'pagination__button'}
                        aria-current={page === currentPage ? 'page' : undefined}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                );
            })}
        </div>
    );
}
