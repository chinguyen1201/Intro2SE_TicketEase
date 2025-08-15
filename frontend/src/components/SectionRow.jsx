import { useRef } from 'react'
import EventCard from './EventCard'

export default function SectionRow({ title, items=[] }){
  const ref = useRef(null)
  const scroll = (dx)=> ref.current && (ref.current.scrollLeft += dx)

  return (
    <section className="section">
      <div className="container">
        <h3>{title}</h3>
        <div className="row">
          <button className="ctrl left" onClick={()=>scroll(-300)}>‹</button>
          <div className="scroller" ref={ref}>
            {items.map(it => <EventCard key={it.id} item={it} />)}
          </div>
          <button className="ctrl right" onClick={()=>scroll(300)}>›</button>
        </div>
      </div>
    </section>
  )
}
