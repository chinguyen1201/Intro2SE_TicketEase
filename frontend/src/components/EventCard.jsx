import { useNavigate } from 'react-router-dom';

export default function EventCard({ item }){
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${item.id}`);
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={item.poster} alt={item.title} />
      <div className="info">
        <div className="name">{item.title}</div>
        <div className="meta">{item.place} • {item.date}</div>
      </div>
    </div>
  )
}
