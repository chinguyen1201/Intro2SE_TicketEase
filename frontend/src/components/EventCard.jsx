export default function EventCard({ item }){
  return (
    <div className="card">
      <img src={item.poster} alt={item.title} />
      <div className="info">
        <div className="name">{item.title}</div>
        <div className="meta">{item.place} • {item.date}</div>
      </div>
    </div>
  )
}
