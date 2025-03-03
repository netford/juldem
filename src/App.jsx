import { useState } from 'react'
import './styles/main.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ReadySuits from './components/ReadySuits'
import PricesSection from './components/PricesSection'
import HowToOrder from './components/HowToOrder'
import ReviewsCarousel from './components/ReviewsCarousel'
import DeliverySection from './components/DeliverySection'
import ContactsSection from './components/ContactsSection'
import Footer from './components/Footer'
import OrderModal from './components/OrderModal'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <ReadySuits />
      <PricesSection />
      <HowToOrder />
      <DeliverySection />
      <About />
      <ReviewsCarousel />
      <ContactsSection />
      <Footer />
   </>
 )
}

export default App