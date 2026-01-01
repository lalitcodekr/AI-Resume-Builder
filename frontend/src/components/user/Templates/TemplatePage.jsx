import { useState, useMemo } from 'react';
import TemplateCategories from './TemplateCategories';
import TemplateCard from './TemplateCard';
import TemplateFilters from './TemplateFilters';
import './TemplatesPage.css';

const TemplatesPage = ({ templates, selectedTemplate, onSelectTemplate, showHeader = false }) => {
  const [templateCategory, setTemplateCategory] = useState('all');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [selectedJobRole, setSelectedJobRole] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const templateCategories = [
    { id: 'all', label: 'All Templates' },
    { id: 'professional', label: 'Professional' },
    { id: 'modern', label: 'Modern' },
    { id: 'creative', label: 'Creative' },
    { id: 'simple', label: 'Simple' },
  ];

  const professions = [
    { id: 'all', label: 'All Professions', icon: '🌐' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
    { id: 'finance', label: 'Finance', icon: '💰' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'engineering', label: 'Engineering', icon: '⚙️' },
    { id: 'sales', label: 'Sales', icon: '📈' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'hospitality', label: 'Hospitality', icon: '🏨' },
  ];

  const jobRolesByProfession = {
    all: [{ id: 'all', label: 'All Roles' }],
    technology: [
      { id: 'all', label: 'All Tech Roles' },
      { id: 'software-engineer', label: 'Software Engineer' },
      { id: 'frontend-developer', label: 'Frontend Developer' },
      { id: 'backend-developer', label: 'Backend Developer' },
      { id: 'fullstack-developer', label: 'Full Stack Developer' },
      { id: 'data-scientist', label: 'Data Scientist' },
      { id: 'devops-engineer', label: 'DevOps Engineer' },
      { id: 'product-manager', label: 'Product Manager' },
      { id: 'qa-engineer', label: 'QA Engineer' },
      { id: 'ui-ux-designer', label: 'UI/UX Designer' },
    ],
    healthcare: [
      { id: 'all', label: 'All Healthcare Roles' },
      { id: 'doctor', label: 'Doctor' },
      { id: 'nurse', label: 'Nurse' },
      { id: 'pharmacist', label: 'Pharmacist' },
      { id: 'medical-assistant', label: 'Medical Assistant' },
      { id: 'healthcare-admin', label: 'Healthcare Administrator' },
      { id: 'therapist', label: 'Therapist' },
    ],
    finance: [
      { id: 'all', label: 'All Finance Roles' },
      { id: 'accountant', label: 'Accountant' },
      { id: 'financial-analyst', label: 'Financial Analyst' },
      { id: 'investment-banker', label: 'Investment Banker' },
      { id: 'auditor', label: 'Auditor' },
      { id: 'tax-consultant', label: 'Tax Consultant' },
      { id: 'financial-advisor', label: 'Financial Advisor' },
    ],
    education: [
      { id: 'all', label: 'All Education Roles' },
      { id: 'teacher', label: 'Teacher' },
      { id: 'professor', label: 'Professor' },
      { id: 'tutor', label: 'Tutor' },
      { id: 'school-admin', label: 'School Administrator' },
      { id: 'curriculum-developer', label: 'Curriculum Developer' },
      { id: 'counselor', label: 'Counselor' },
    ],
    marketing: [
      { id: 'all', label: 'All Marketing Roles' },
      { id: 'marketing-manager', label: 'Marketing Manager' },
      { id: 'digital-marketer', label: 'Digital Marketer' },
      { id: 'content-writer', label: 'Content Writer' },
      { id: 'seo-specialist', label: 'SEO Specialist' },
      { id: 'social-media-manager', label: 'Social Media Manager' },
      { id: 'brand-manager', label: 'Brand Manager' },
    ],
    design: [
      { id: 'all', label: 'All Design Roles' },
      { id: 'graphic-designer', label: 'Graphic Designer' },
      { id: 'ui-designer', label: 'UI Designer' },
      { id: 'ux-designer', label: 'UX Designer' },
      { id: 'product-designer', label: 'Product Designer' },
      { id: 'interior-designer', label: 'Interior Designer' },
      { id: 'motion-designer', label: 'Motion Designer' },
    ],
    engineering: [
      { id: 'all', label: 'All Engineering Roles' },
      { id: 'mechanical-engineer', label: 'Mechanical Engineer' },
      { id: 'civil-engineer', label: 'Civil Engineer' },
      { id: 'electrical-engineer', label: 'Electrical Engineer' },
      { id: 'chemical-engineer', label: 'Chemical Engineer' },
      { id: 'project-engineer', label: 'Project Engineer' },
      { id: 'structural-engineer', label: 'Structural Engineer' },
    ],
    sales: [
      { id: 'all', label: 'All Sales Roles' },
      { id: 'sales-representative', label: 'Sales Representative' },
      { id: 'account-executive', label: 'Account Executive' },
      { id: 'sales-manager', label: 'Sales Manager' },
      { id: 'business-development', label: 'Business Development' },
      { id: 'retail-sales', label: 'Retail Sales' },
      { id: 'inside-sales', label: 'Inside Sales' },
    ],
    legal: [
      { id: 'all', label: 'All Legal Roles' },
      { id: 'lawyer', label: 'Lawyer' },
      { id: 'paralegal', label: 'Paralegal' },
      { id: 'legal-assistant', label: 'Legal Assistant' },
      { id: 'corporate-counsel', label: 'Corporate Counsel' },
      { id: 'compliance-officer', label: 'Compliance Officer' },
    ],
    hospitality: [
      { id: 'all', label: 'All Hospitality Roles' },
      { id: 'hotel-manager', label: 'Hotel Manager' },
      { id: 'chef', label: 'Chef' },
      { id: 'event-planner', label: 'Event Planner' },
      { id: 'front-desk', label: 'Front Desk' },
      { id: 'restaurant-manager', label: 'Restaurant Manager' },
      { id: 'concierge', label: 'Concierge' },
    ],
  };

  const availableJobRoles = useMemo(() => {
    return jobRolesByProfession[selectedProfession] || jobRolesByProfession.all;
  }, [selectedProfession]);

  const handleProfessionChange = (professionId) => {
    setSelectedProfession(professionId);
    setSelectedJobRole('all');
  };

  const clearFilters = () => {
    setTemplateCategory('all');
    setSelectedProfession('all');
    setSelectedJobRole('all');
  };

  const activeFiltersCount = [
    templateCategory !== 'all',
    selectedProfession !== 'all',
    selectedJobRole !== 'all'
  ].filter(Boolean).length;

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesCategory = templateCategory === 'all' || t.category === templateCategory;
      const matchesProfession = selectedProfession === 'all' || t.profession === selectedProfession;
      const matchesJobRole = selectedJobRole === 'all' || t.jobRole === selectedJobRole;
      return matchesCategory && matchesProfession && matchesJobRole;
    });
  }, [templates, templateCategory, selectedProfession, selectedJobRole]);

  return (
    <div className={showHeader ? 'templates-page-full' : 'templates-section'}>
      {showHeader && (
        <div className="page-header">
          <h1>📄 Resume Templates</h1>
          <p>Choose from our professionally designed ATS-friendly templates</p>
        </div>
      )}
      
      <div className="templates-header">
        <div className="templates-header-content">
          <h2>Choose Your Template</h2>
          <p>Select from our ATS-optimized professional templates</p>
        </div>
        <button 
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <span className="filter-icon">🔍</span>
          Filters
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <TemplateFilters
          professions={professions}
          selectedProfession={selectedProfession}
          onProfessionChange={handleProfessionChange}
          jobRoles={availableJobRoles}
          selectedJobRole={selectedJobRole}
          onJobRoleChange={setSelectedJobRole}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      )}
      
      <TemplateCategories 
        categories={templateCategories}
        activeCategory={templateCategory}
        onSelectCategory={setTemplateCategory}
      />

      <div className="templates-results-info">
        <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found</span>
        {activeFiltersCount > 0 && (
          <button className="clear-all-btn" onClick={clearFilters}>
            Clear all filters
          </button>
        )}
      </div>

      <div className="templates-grid">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard 
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={onSelectTemplate}
            />
          ))
        ) : (
          <div className="no-templates-found">
            <span className="no-results-icon">🔍</span>
            <h3>No templates found</h3>
            <p>Try adjusting your filters to find more templates</p>
            <button className="reset-filters-btn" onClick={clearFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;