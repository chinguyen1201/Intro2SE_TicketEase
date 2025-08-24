import { useNavigate } from 'react-router-dom';

export default function EventCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${item.id}`);
  };

  console.log("EventCard item: ", item);

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img src={item.poster} alt={item.name} />
      <div className="info">
        <div className="name">{item.name}</div>
        <div className="meta">{item.location} • {item.start_date}</div>
      </div>
    </div>
  )
}
