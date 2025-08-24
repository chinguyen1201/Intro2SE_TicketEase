import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import NavbarLoggedIn from '../components/NavbarLoggedIn';
import HeroCarousel from '../components/HeroCarousel';
import SectionRow from '../components/SectionRow';
import Footer from '../components/Footer';
import LogoutSuccess from '../components/LogoutSuccess';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading, successMessage } = useSelector(state => state.auth);
  const [events, setEvents] = useState({
    special: [],
    trending: [],
    live: [],
    stage: [],
    others: []
  });
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await fetch('http://localhost:3000/customers/');
        const data = await response.json();

        // Assuming the API returns categorized events
        setEvents({
          special: data || [],
          trending: data || [],
          live: data || [],
          stage: data || [],
          others: data || []
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Show loading while checking authentication or fetching events
  if (isLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {/* Conditionally render navbar based on authentication status */}
      {isAuthenticated ? <NavbarLoggedIn /> : <Navbar />}

      {/* Logout success notification */}
      <LogoutSuccess show={successMessage && successMessage.includes('logout')} />

      <div className="container" style={{ marginTop: 16 }}>
        <HeroCarousel />
      </div>

      <SectionRow title="Sự kiện đặc biệt" items={events.special} />
      <SectionRow title="Sự kiện xu hướng" items={events.trending} />
      <SectionRow title="Nhạc sống" items={events.live} />
      <SectionRow title="Sân khấu & Nghệ thuật" items={events.stage} />
      <SectionRow title="Thể loại khác" items={events.others} />

      <Footer />
    </>
  )
}
