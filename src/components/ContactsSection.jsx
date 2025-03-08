import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactsSection = () => {
  return (
    <section id="contacts" className="contacts-section">
      <style>{`
        .contacts-section {
          padding: 6rem 0;
          background: #1a1a1a;
          color: #fff;
          min-height: 100vh;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          color: #fff;
          margin-bottom: 1rem;
        }

        .contacts-wrapper {
          display: grid;
          grid-template-columns: 350px 3fr;
          gap: 2rem;
          height: 600px;
          max-width: 1800px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .contacts-card {
          background: #262626;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 2.5rem;
          height: 100%;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .contact-item:hover {
          transform: translateX(5px);
          background: rgba(255, 255, 255, 0.1);
        }

        .contact-icon {
          background: var(--color-primary);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .contact-item:hover .contact-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .contact-icon svg {
          color: #fff;
          width: 20px;
          height: 20px;
        }

        .contact-info {
          flex: 1;
        }

        .contact-label {
          color: #999;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .contact-value {
          color: #fff;
          font-size: 1rem;
          line-height: 1.5;
        }

        .contact-link {
          color: #fff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: var(--color-primary);
        }

        .social-networks {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-title {
          color: #fff;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 500;
          text-align: center;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .social-link {
          text-decoration: none;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-icon svg {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }

        .social-icon:hover svg {
          transform: scale(1.2);
        }

        .social-icon.youtube {
          background: #FF0000;
          color: white;
        }

        .social-icon.telegram {
          background: #0088cc;
          color: white;
        }

        .social-icon.whatsapp {
          background: #25D366;
          color: white;
        }

        .social-icon.vk {
          background: #4C75A3;
          color: white;
        }

        .map-container {
          position: relative;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          width: 100%;
        }

        .map-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        @media (max-width: 1200px) {
          .contacts-wrapper {
            grid-template-columns: 350px 2fr;
          }
        }

        @media (max-width: 992px) {
          .contacts-wrapper {
            grid-template-columns: 1fr;
            height: auto;
            gap: 1.5rem;
          }

          .map-container {
            height: 400px;
          }
        }

        @media (max-width: 768px) {
          .contacts-section {
            padding: 4rem 0;
          }

          .contacts-card {
            padding: 1.5rem;
          }

          .contact-item:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="section-header">
        <h2 className="section-title">Контакты</h2>
      </div>

      <div className="contacts-wrapper">
        <div className="contacts-card">
          <div className="contacts-list">
            <div className="contact-item">
              <div className="contact-icon">
                <Phone />
              </div>
              <div className="contact-info">
                <div className="contact-label">Телефон</div>
                <a href="tel:+79196853312" className="contact-link contact-value">
                  +7 (919) 685-33-12
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Mail />
              </div>
              <div className="contact-info">
                <div className="contact-label">Email</div>
                <a href="mailto:info@juldem.ru" className="contact-link contact-value">
                  info@juldem.ru
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <MapPin />
              </div>
              <div className="contact-info">
                <div className="contact-label">Адрес</div>
                <div className="contact-value">
                  г. Набережные Челны, б-р Кереселидзе, д. 2/99
                </div>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <Clock />
              </div>
              <div className="contact-info">
                <div className="contact-label">Время работы</div>
                <div className="contact-value">
                  Пн-Пт: 10:00 - 19:00<br />
                  Сб: 11:00 - 17:00
                </div>
              </div>
            </div>

            <div className="social-networks">
              <div className="social-title">Мы в соцсетях</div>
              <div className="social-icons">
                {/* <a href="#" className="social-link" aria-label="YouTube">
                  <div className="social-icon youtube">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </a> */}
                <a 
                  href="https://t.me/juliaDemina_nch" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="Telegram"
                >
                  <div className="social-icon telegram">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-1.082.362-1.61.984-.133.155-.267.354-.335.628s-.038.622.095.895c.265.547.714.773 1.244.976 1.76.564 3.58 1.102 5.087 1.608.503 1.388 1.706 4.618 1.95 5.264.126.333.256.629.374.826.059.099.12.186.18.258.115.14.237.226.363.285.468.192.818-.004 1.024-.315.935-1.424 2.963-4.48 3.535-5.348 7.08 2.982 8.025 3.436 8.668 3.436.344 0 .645-.139.881-.366.236-.227.353-.52.353-.813 0-.124-.016-.248-.048-.37-.038-.131-.11-.257-.196-.377-.087-.12-.704-.994-4.238-5.622-.806-1.058-1.31-1.857-1.178-2.366.036-.114.12-.21.248-.336 3.568-3.46 5.13-4.99 5.612-5.849.192-.185.33-.267.44-.37.204-.32.22-.688.112-1.02-.11-.332-.365-.55-.648-.633-.106-.034-.22-.045-.31-.06z"/>
                    </svg>
                  </div>
                </a>
                <a href="https://api.whatsapp.com/send/?phone=79196853312&text&type=phone_number&app_absent=0" className="social-link" aria-label="WhatsApp">
                  <div className="social-icon whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                </a>
                <a 
                  href="https://vk.com/juliademina_nch" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-link" 
                  aria-label="ВКонтакте"
                >
                  <div className="social-icon vk">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.677-1.253.677-1.846 0-3.896-1.12-5.336-3.202-2.164-3.047-2.76-5.336-2.76-5.81 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.848 2.455 2.27 4.607 2.862 4.607.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.76c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.322-.491.813-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.72-.576.72z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="map-container">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab696df2fc21545adbe50d3425866ebbea11fb5956ec7cf0467c5018b960509bc&amp;source=constructor" 
            title="Карта расположения"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;