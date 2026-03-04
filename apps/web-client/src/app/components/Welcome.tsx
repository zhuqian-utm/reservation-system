import React from 'react';
import { Mail, Phone, MapPin, Clock, CalendarDays } from 'lucide-react';

// Hilton Brand Colors
const colors = {
  darkBlue: '#002C5F',
  gold: '#C5A065',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
};

const HiltonWelcomePage: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        color: colors.darkBlue,
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: colors.lightGray,
        }}
      >
        <h1
          style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          Welcome to Hilton Reservations
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#555',
            maxWidth: '800px',
            margin: '0 auto 2rem',
          }}
        >
          Experience world-class dining and unparalleled hospitality. Book your
          table or suite with ease using our seamless reservation system.
        </p>
      </section>

      {/* Main Content Area */}
      <main
        style={{
          padding: '4rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Left Column: Dining Info & Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                borderBottom: `3px solid ${colors.gold}`,
                paddingBottom: '0.5rem',
                marginBottom: '1.5rem',
              }}
            >
              Our Signature Restaurants
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
              }}
            >
              {/* Restaurant Card 1 */}
              <div
                style={{
                  flex: '0 0 250px',
                  backgroundColor: colors.white,
                  padding: '1.5rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <img
                  src="/bg_1.jpeg"
                  alt="Restaurant Interior"
                  style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                  }}
                />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                  The Brasserie
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Classic French cuisine in an elegant setting.
                </p>
              </div>
              {/* Restaurant Card 2 */}
              <div
                style={{
                  flex: '0 0 250px',
                  backgroundColor: colors.white,
                  padding: '1.5rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                }}
              >
                <img
                  src="/bg_2.jpeg"
                  alt="Chef Cooking"
                  style={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                  }}
                />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                  Sakura Sushi Bar
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  Fresh, authentic Japanese flavors.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Why Reserve with Us?
            </h2>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <li
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <CalendarDays size={20} color={colors.gold} /> Instant
                Confirmation
              </li>
              <li
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <Clock size={20} color={colors.gold} /> Flexible Booking Times
              </li>
              <li
                style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <MapPin size={20} color={colors.gold} /> Prime Location
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Location & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Our Location
            </h2>
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#555',
                marginBottom: '1.5rem',
              }}
            >
              <MapPin size={20} />
            </p>

            <img
              src="/Hilton_logo.png"
              alt="Hilton Logo"
              style={{ height: '300px' }}
            />
          </div>

          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Contact Us
            </h2>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                color: '#555',
              }}
            >
              <p
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Mail size={18} /> dining.singapore@hilton.com
              </p>
              <p
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Phone size={18} /> +65 6737 2233
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: colors.lightGray,
          padding: '2rem',
          textAlign: 'center',
          marginTop: '4rem',
          borderTop: '1px solid #ddd',
        }}
      >
        <p style={{ color: '#777', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Hilton. All rights reserved.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: colors.darkBlue,
          }}
        >
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
            Privacy Policy
          </a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HiltonWelcomePage;
