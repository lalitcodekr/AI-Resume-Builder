const TemplateCard = ({ template, isSelected, onSelect }) => {
  const formatLabel = (str) => {
    if (!str) return '';
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className={`template-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(template.id)}
    >
      <div className="template-preview-box" style={{ borderTopColor: template.color }}>
        {template.popular && <span className="popular-badge">⭐ Popular</span>}
        {isSelected && <span className="selected-badge">✓ Selected</span>}
        <div className="template-mock">
          <div className="mock-header" style={{ backgroundColor: template.color }}></div>
          <div className="mock-avatar"></div>
          <div className="mock-lines">
            <div className="mock-line w-60"></div>
            <div className="mock-line w-40"></div>
            <div className="mock-line w-80"></div>
            <div className="mock-line w-70"></div>
          </div>
          <div className="mock-section">
            <div className="mock-line w-30" style={{ backgroundColor: template.color, opacity: 0.3 }}></div>
            <div className="mock-line w-90"></div>
            <div className="mock-line w-85"></div>
          </div>
        </div>
      </div>
      <div className="template-info">
        <h3>{template.name}</h3>
        <div className="template-meta">
          <span className="template-category-tag">{template.category}</span>
          <span className="ats-score-badge">ATS: {template.atsScore}%</span>
        </div>
        {(template.profession || template.jobRole) && (
          <div className="template-tags">
            {template.profession && (
              <span className="profession-tag">{formatLabel(template.profession)}</span>
            )}
            {template.jobRole && template.jobRole !== 'all' && (
              <span className="job-role-tag">{formatLabel(template.jobRole)}</span>
            )}
          </div>
        )}
      </div>
      <div className="template-actions">
        <button 
          className="use-template-btn" 
          onClick={(e) => { e.stopPropagation(); onSelect(template.id); }}
        >
          Use Template
        </button>
        <button 
          className="preview-template-btn" 
          onClick={(e) => e.stopPropagation()}
        >
          Preview
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;