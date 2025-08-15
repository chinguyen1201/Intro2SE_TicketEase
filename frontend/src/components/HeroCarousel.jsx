import { useState } from 'react'

const slides = [
  { id:1, img:'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop', title:'CONCERT M', subtitle:'Yuuki Chiba • 24/4/2025' },
  { id:2, img:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop', title:'LIVE THE MUSIC', subtitle:'Downtown Arena • 19:30' },
  { id:3, img:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop', title:'BUSINESS CONFERENCE', subtitle:'Saigon Center • 09:00' },
]

export default function HeroCarousel(){
  const [idx,setIdx] = useState(0)
  const next = ()=> setIdx((idx+1)%slides.length)
  const prev = ()=> setIdx((idx-1+slides.length)%slides.length)
  const s = slides[idx]

  return (
    <div className="hero">
      <img src={s.img} alt={s.title} />
      <div className="overlay">
        <div className="content">
          <div className="title">{s.title}</div>
          <div className="subtitle">{s.subtitle}</div>
          <div className="cta"><button>Xem chi tiết</button></div>
        </div>
      </div>
      <div className="nav">
        <button className="arrow" onClick={prev}>‹</button>
        <button className="arrow" onClick={next}>›</button>
      </div>
    </div>
  )
}
