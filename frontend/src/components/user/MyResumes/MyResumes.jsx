import { useState, useEffect, useRef } from "react";
import "./myresumes.css";
import UserNavBar from "../UserNavBar/UserNavBar"; // ✅ keep navbar

const initialResumes = [
  {
    title: "Senior Software Engineer",
    created: "2023-10-26",
    modified: "2 hours ago",
    format: "PDF",
    score: "75/100",
    color: "green",
  },
  {
    title: "Marketing Manager - Tech",
    created: "2023-10-20",
    modified: "yesterday",
    format: "Word",
    score: "88/100",
    color: "blue",
  },
  {
    title: "Product Manager Resume (Entry)",
    created: "2023-09-15",
    modified: "3 days ago",
    format: "PDF",
    score: "62/100",
    color: "orange",
  },
  {
    title: "Data Analyst (Intern)",
    created: "2023-08-01",
    modified: "1 week ago",
    format: "PDF",
    score: "91/100",
    color: "green",
  },
];

export default function MyResumes({ onSidebarToggle }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [resumes, setResumes] = useState(initialResumes);
  const dropdownRef = useRef(null);

  // ---- Custom confirm modal state ----
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    index: null,
    title: "",
  });

  // ---- Close dropdown when clicking outside ----
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openMenu !== null &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openMenu]);

  // ---- Delete handler (opens custom modal) ----
  const handleDelete = (index) => {
    const resumeTitle = resumes[index].title;
    setConfirmModal({ visible: true, index, title: resumeTitle });
    setOpenMenu(null); // close the dropdown
  };

  // ---- Confirm deletion ----
  const confirmDelete = () => {
    setResumes((prev) => prev.filter((_, i) => i !== confirmModal.index));
    setConfirmModal({ visible: false, index: null, title: "" });
  };

  // ---- Cancel deletion ----
  const cancelDelete = () => {
    setConfirmModal({ visible: false, index: null, title: "" });
  };

  return (
    <div className="myresumes-page user-page">
      {/* ✅ Navbar */}
      <UserNavBar
        onMenuClick={onSidebarToggle || (() => console.log("Toggle sidebar"))}
      />

      {/* CONTENT BELOW NAVBAR */}
      <div className="myresumes-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>My Resumes</h1>
            <p>Manage all your resume documents.</p>
          </div>
          <button className="create-btn">+ Create New</button>
        </div>

        {/* Table / Card Section */}
        <div className="card">
          <div className="filter-row">
            <div className="filter-input">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z" />
              </svg>
              <input placeholder="Search templates accordingly..." />
            </div>
            <button className="format-btn">All Formats</button>
          </div>

          {/* Table */}
          {resumes.length === 0 ? (
            <div className="empty-state">
              <p>🗂️ No resumes found. Click <strong>+ Create New</strong> to get started!</p>
            </div>
          ) : (
            <table className="resume-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date Created</th>
                  <th>Last Modified</th>
                  <th>Format</th>
                  <th>AI Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume, index) => (
                  <tr key={resume.title + resume.created}>
                    <td data-label="Title">{resume.title}</td>
                    <td data-label="Date Created">{resume.created}</td>
                    <td data-label="Last Modified">{resume.modified}</td>
                    <td data-label="Format">{resume.format}</td>
                    <td data-label="AI Score" className={`score ${resume.color}`}>{resume.score}</td>
                    <td data-label="Actions" className="actions">
                      <button className="action-btn" title="View">
                        <svg className="icon" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <div className="dropdown-wrapper" ref={openMenu === index ? dropdownRef : null}>
                        <button
                          className="dots-btn"
                          onClick={() =>
                            setOpenMenu(openMenu === index ? null : index)
                          }
                        >
                          ⋮
                        </button>
                        {openMenu === index && (
                          <div className="dropdown-menu">
                            <button>Edit</button>
                            <button>Download</button>
                            <button
                              className="danger"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table Bottom */}
          {resumes.length > 0 && (
            <div className="table-bottom">
              <span>Showing 1 to {resumes.length} of {resumes.length} resumes</span>
              <div className="pagination">
                <button>‹</button>
                <button className="active">1</button>
                <button>›</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">© 2023 ResumeAI Inc. All rights reserved.</footer>
      </div>

      {/* ===== Custom Confirm Modal ===== */}
      {confirmModal.visible && (
        <div className="confirm-overlay" onClick={cancelDelete}>
          <div
            className="confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon */}
            <div className="confirm-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86l-8.8 15.32A2 2 0 003.23 22h17.54a2 2 0 001.74-2.82l-8.8-15.32a2 2 0 00-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="confirm-title">Delete Resume</h3>
            <p className="confirm-message">
              Are you sure you want to delete "{confirmModal.title}"? This
              action cannot be undone.
            </p>

            <div className="confirm-actions">
              <button className="confirm-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

