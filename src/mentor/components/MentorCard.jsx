// src/mentor/components/MentorCard.jsx
const MentorCard = ({ title, description, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border-l-4 border-amber-500">
      <h3 className="text-xl font-semibold text-amber-600">{title}</h3>
      <p className="text-gray-700 mb-2">{description}</p>
      {children}
    </div>
  );
};

export default MentorCard;
