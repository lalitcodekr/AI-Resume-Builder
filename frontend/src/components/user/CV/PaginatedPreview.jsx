import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 60;
const FOOTER_HEIGHT = 30;
const USABLE_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2 - FOOTER_HEIGHT;
const MIN_REMAINING_SPACE = 150; // Minimum space needed to keep content on page

const PaginatedPreview = ({ children, zoom = 1 }) => {
    const measureRef = useRef(null);
    const [pageBreaks, setPageBreaks] = useState([0]);
    const [currentPage, setCurrentPage] = useState(1);

    const findSmartPageBreaks = useCallback(() => {
        if (!measureRef.current) return;

        const container = measureRef.current;
        const totalHeight = container.scrollHeight;

        // Get all direct children (major sections)
        const sections = Array.from(container.children);

        if (sections.length === 0) {
            const pages = Math.ceil(totalHeight / USABLE_HEIGHT);
            setPageBreaks(Array.from({ length: pages }, (_, i) => i * USABLE_HEIGHT));
            return;
        }

        const breaks = [0];
        let currentBreak = 0;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;

            // Where does this section sit relative to current page?
            const distanceFromBreak = sectionTop - currentBreak;
            const sectionEndRelativeToBreak = sectionBottom - currentBreak;

            // If section would extend beyond current page
            if (sectionEndRelativeToBreak > USABLE_HEIGHT) {
                // If section starts within current page but doesn't fit
                if (distanceFromBreak < USABLE_HEIGHT) {
                    // Check if there's enough room left on page
                    const spaceRemaining = USABLE_HEIGHT - distanceFromBreak;

                    if (spaceRemaining < MIN_REMAINING_SPACE || sectionHeight < USABLE_HEIGHT) {
                        // Not enough space, move entire section to next page
                        breaks.push(sectionTop);
                        currentBreak = sectionTop;
                    } else {
                        // Section is very large, let it span pages
                        // Create break at page boundary
                        breaks.push(currentBreak + USABLE_HEIGHT);
                        currentBreak = currentBreak + USABLE_HEIGHT;
                    }
                } else {
                    // Section starts beyond current page
                    breaks.push(sectionTop);
                    currentBreak = sectionTop;
                }
            }
        });

        // Fill remaining content
        while (currentBreak + USABLE_HEIGHT < totalHeight) {
            currentBreak += USABLE_HEIGHT;
            breaks.push(currentBreak);
        }

        const uniqueBreaks = [...new Set(breaks)].sort((a, b) => a - b);
        setPageBreaks(uniqueBreaks);

        if (currentPage > uniqueBreaks.length) {
            setCurrentPage(1);
        }
    }, [currentPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            findSmartPageBreaks();
        }, 150);

        return () => clearTimeout(timer);
    }, [children, findSmartPageBreaks]);

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            findSmartPageBreaks();
        });

        if (measureRef.current) {
            observer.observe(measureRef.current);
        }

        return () => observer.disconnect();
    }, [children, findSmartPageBreaks]);

    const goToNextPage = () => {
        if (currentPage < pageBreaks.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const pageIndex = currentPage - 1;
    const totalPages = pageBreaks.length;
    const currentOffset = pageBreaks[pageIndex] || 0;

    return (
        <div className="paginated-preview-wrapper flex flex-col items-center gap-4">
            {/* Hidden measurement container */}
            <div
                ref={measureRef}
                className="paginated-measure-box"
                aria-hidden="true"
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                    width: PAGE_WIDTH - PAGE_PADDING * 2,
                    left: -9999,
                }}
            >
                {children}
            </div>

            {/* Navigation buttons - Top */}
            {totalPages > 1 && (
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        title="Previous page"
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                        <span className="text-sm font-semibold text-slate-700">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        title="Next page"
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Single visible page */}
            <div
                className="bg-white shadow-lg relative"
                style={{
                    width: PAGE_WIDTH * zoom,
                    height: PAGE_HEIGHT * zoom,
                }}
            >
                <div
                    style={{
                        width: PAGE_WIDTH,
                        height: PAGE_HEIGHT,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                        position: "relative",
                        overflow: "hidden",
                        background: "white",
                    }}
                >
                    {/* Content area */}
                    <div
                        style={{
                            position: "absolute",
                            top: PAGE_PADDING,
                            left: PAGE_PADDING,
                            right: PAGE_PADDING,
                            height: USABLE_HEIGHT,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            className="paginated-content-slice"
                            style={{
                                position: "relative",
                                top: -currentOffset,
                                width: PAGE_WIDTH - PAGE_PADDING * 2,
                            }}
                        >
                            {children}
                        </div>
                    </div>

                    {/* Page number footer */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 10,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: FOOTER_HEIGHT - 10,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 9,
                                color: "#94a3b8",
                                fontFamily: "system-ui, -apple-system, sans-serif",
                                fontWeight: 500,
                                letterSpacing: "0.5px",
                            }}
                        >
                            {currentPage} / {totalPages}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation buttons - Bottom */}
            {totalPages > 1 && (
                <div className="flex items-center gap-3 mt-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        title="Previous page"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <span className="text-xs text-slate-600 font-medium">
                        {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        title="Next page"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaginatedPreview;
