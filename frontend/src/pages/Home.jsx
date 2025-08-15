import Navbar from '../components/Navbar'
import HeroCarousel from '../components/HeroCarousel'
import SectionRow from '../components/SectionRow'
import Footer from '../components/Footer'


// Dữ liệu demo (poster dùng picsum để đỡ phải tải ảnh)
const mkPoster = (seed)=> `https://picsum.photos/seed/${seed}/600/800`
const makeItems = (prefix, n=8)=> Array.from({length:n}).map((_,i)=>({
  id: `${prefix}-${i+1}`,
  title: ['WOODRUFF P.S.','VOLUNTEERS NEEDED','MUSIC EVENT','LIVE THE MUSIC','BUSINESS CONF.'][i%5],
  poster: mkPoster(prefix + (i+1)),
  place: ['QK7 Stadium','Crescent Mall','Saigon Center','Youth Theatre'][i%4],
  date: 'Fri, 24th',
}))

const special = makeItems('sp',8)
const trending = makeItems('tr',8)
const live = makeItems('live',8)
const stage = makeItems('stage',8)
const others = makeItems('other',8)

export default function Home(){
  return (
    <>
      <Navbar/>
      <div className="container" style={{marginTop:16}}>
        <HeroCarousel/>
      </div>
      
      <SectionRow title="Sự kiện đặc biệt" items={special}/>
      <SectionRow title="Sự kiện xu hướng" items={trending}/>
      <SectionRow title="Nhạc sống" items={live}/>
      <SectionRow title="Sân khấu & Nghệ thuật" items={stage}/>
      <SectionRow title="Thể loại khác" items={others}/>

      <Footer/>
    </>
  )
}
