import React, { useEffect, useState } from 'react';
import { X, Calendar, Phone, User, Clock, Shield, CreditCard } from 'lucide-react';
import ReactDOM from 'react-dom';

const RentalFormModal = ({ isOpen, onClose, product }) => {
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: '',
    performanceDate: ''
  });
  
  // Состояние для кастомного календаря
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  
  // Состояние для обработки UI
  const [timeSlots, setTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Генерация временных слотов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setTimeSlots(generateTimeSlots());
      setFormData({
        name: '',
        phone: '',
        callTime: '',
        performanceDate: ''
      });
      setSuccess(false);
      
      // Блокируем прокрутку страницы при открытии модального окна
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Разрешаем прокрутку страницы при закрытии модального окна
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Функция для генерации временных слотов
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    // Генерация слотов на сегодня
    for (let hour = 10; hour < 19; hour++) {
      // Пропускаем прошедшие часы
      if (hour < currentHour) continue;
      
      // Пропускаем текущий час, если до его окончания осталось менее 15 минут
      if (hour === currentHour && currentMinutes > 45) continue;

      slots.push({
        value: `today-${hour}`,
        label: `Сегодня с ${hour}:00 до ${hour + 1}:00`
      });
    }

    // Генерация слотов на завтра
    for (let hour = 10; hour < 19; hour++) {
      slots.push({
        value: `tomorrow-${hour}`,
        label: `Завтра с ${hour}:00 до ${hour + 1}:00`
      });
    }

    return slots;
  };

  // Обработчик изменения для полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Особая обработка для телефона
    if (name === 'phone') {
      // Получаем только цифры из ввода
      const digits = value.replace(/\D/g, '');
      
      // Ограничиваем до 10 цифр (без учета кода +7)
      const limitedDigits = digits.slice(0, 10);
      
      // Форматируем телефон с скобками и дефисами
      let formattedPhone = '';
      
      if (limitedDigits.length > 0) {
        formattedPhone += '(' + limitedDigits.slice(0, 3);
        
        if (limitedDigits.length > 3) {
          formattedPhone += ') ' + limitedDigits.slice(3, 6);
          
          if (limitedDigits.length > 6) {
            formattedPhone += '-' + limitedDigits.slice(6, 8);
            
            if (limitedDigits.length > 8) {
              formattedPhone += '-' + limitedDigits.slice(8, 10);
            }
          }
        } else {
          formattedPhone += ')';
        }
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: formattedPhone 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  // Форматирование даты из yyyy-mm-dd в dd.mm.yyyy для отображения в поле
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки на сервер
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Автоматическое закрытие через 3 секунды
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  // Обработка нажатия клавиши ESC для закрытия модального окна
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Если модальное окно не открыто или нет данных о продукте - не рендерим
  if (!isOpen || !product) return null;

  // Стили для модального окна в виде объектов
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: isMobile ? '1rem' : '2rem',
    overflow: 'auto'
  };

  const modalStyles = {
    backgroundColor: '#262626',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    padding: isMobile ? '1.5rem' : '2rem',
    color: '#fff',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    border: '1px solid #333',
    margin: '0 auto'
  };

  const headerStyles = {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333',
    textAlign: 'center'
  };

  const titleStyles = {
    fontSize: isMobile ? '1.8rem' : '2rem',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  };

  const productCardStyles = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    border: '1px solid #333'
  };

  const imageContainerStyles = {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const productInfoStyles = {
    flex: 1,
    paddingTop: '4px'
  };

  const productNameStyles = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
    color: '#fff'
  };

  const tagContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  };

  const sizeInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    color: '#0088ff',
    fontSize: '0.95rem'
  };

  const priceInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    color: '#ffc107',
    fontSize: '0.95rem'
  };

  // Стили кнопки закрытия, аналогичные OrderModal
  const closeButtonStyles = {
    position: 'absolute',
    top: isMobile ? '0.5rem' : '1rem',
    right: isMobile ? '0.5rem' : '1rem',
    background: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    width: isMobile ? '36px' : '44px',
    height: isMobile ? '36px' : '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    zIndex: 2,
    transition: 'all 0.3s ease',
    padding: isMobile ? '6px' : '8px'
  };

  const noteStyles = {
    color: '#ddd',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const formGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyles = {
    fontSize: '0.9rem',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  };

  const twoColumnContainerStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '1rem'
  };

  const phoneInputContainerStyles = {
    position: 'relative'
  };

  const phoneCodeStyles = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#fff'
  };

  const submitButtonStyles = {
    width: '100%',
    padding: '0.85rem',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  // Создаем элемент для модального окна и устанавливаем его инлайн-стили
  const modalContent = (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles}>
        {/* Кнопка закрытия с тем же подходом, как в OrderModal */}
        <button
          onClick={onClose}
          style={closeButtonStyles}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.borderColor = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          <X size={isMobile ? 22 : 28} strokeWidth={2.5} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1rem',
              backgroundColor: '#00b894',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>
              Спасибо за заявку!
            </h2>
            <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
              Мы свяжемся с вами в ближайшее время для уточнения деталей аренды.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              Автоматическое закрытие через 3 секунды...
            </p>
          </div>
        ) : (
          <>
            <div style={headerStyles}>
              <h2 style={titleStyles}>Забронировать</h2>
            </div>

            {/* Информация о товаре */}
            <div style={productCardStyles}>
              <div style={imageContainerStyles}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={imageStyles} 
                />
              </div>
              <div style={productInfoStyles}>
                <h3 style={productNameStyles}>Купальник "{product.name}"</h3>
                <div style={tagContainerStyles}>
                  <div style={sizeInfoStyles}>
                    <Shield size={16} color="#0088ff" style={{ marginRight: '8px' }} />
                    Рост: {product.height}
                  </div>
                  <div style={priceInfoStyles}>
                    <CreditCard size={16} color="#ffc107" style={{ marginRight: '8px' }} />
                    Аренда / Залог: {product.price} / {product.deposit} ₽
                  </div>
                </div>
              </div>
            </div>

            <div style={noteStyles}>
              Мы свяжемся с вами в указанное время по указанному номеру телефона для уточнения деталей аренды.
            </div>
            
            <form style={formStyles} onSubmit={handleSubmit}>
              {/* Имя */}
              <div style={formGroupStyles}>
                <label htmlFor="name" style={labelStyles}>
                  <User size={16} color="#3498db" /> Ваше имя:
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Введите ваше имя"
                  style={inputStyles}
                />
              </div>
              
              {/* Два поля в одном ряду */}
              <div style={twoColumnContainerStyles}>
                {/* Дата выступления */}
                <div style={formGroupStyles}>
                  <label htmlFor="performanceDateDisplay" style={labelStyles}>
                    <Calendar size={16} color="#3498db" /> Дата выступления:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      id="performanceDateDisplay" 
                      value={formData.performanceDate ? formatDate(formData.performanceDate) : ''} 
                      placeholder="ДД.ММ.ГГГГ"
                      readOnly
                      onClick={() => setShowCustomCalendar(!showCustomCalendar)}
                      style={{
                        ...inputStyles,
                        cursor: 'pointer'
                      }}
                    />
                    <Calendar 
                      size={16} 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '1rem',
                        transform: 'translateY(-50%)',
                        color: '#999',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Телефон */}
                <div style={formGroupStyles}>
                  <label htmlFor="phone" style={labelStyles}>
                    <Phone size={16} color="#3498db" /> Телефон:
                  </label>
                  <div style={phoneInputContainerStyles}>
                    <span style={phoneCodeStyles}>+7</span>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="(___) ___-__-__"
                      required 
                      style={{
                        ...inputStyles,
                        paddingLeft: '2.5rem'
                      }}
                    />
                  </div>
                </div>
              </div>
                
              {/* Время для звонка */}
              <div style={formGroupStyles}>
                <label htmlFor="callTime" style={labelStyles}>
                  <Clock size={16} color="#3498db" /> Удобное время для звонка:
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    id="callTime" 
                    name="callTime" 
                    value={formData.callTime} 
                    onChange={handleChange} 
                    required
                    style={{
                      ...inputStyles,
                      appearance: 'none'
                    }}
                  >
                    <option value="">Выберите время</option>
                    {timeSlots.map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '1rem',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Чекбокс согласия с условиями */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="agree"
                  required
                  style={{ marginTop: '0.25rem' }}
                />
                <label htmlFor="agree" style={{ fontSize: '0.9rem', color: '#bbb' }}>
                  Я ознакомлен/а с <a href="#" style={{ color: '#3498db', textDecoration: 'none' }}>условиями проката</a> и согласен/на с ними
                </label>
              </div>
                
              {/* Кнопка отправки */}
              <button 
                type="submit" 
                style={{
                  ...submitButtonStyles,
                  backgroundColor: isSubmitting ? '#555' : '#0066cc',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>
                    <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="60 28" />
                  </svg>
                )}
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );

  // Используем ReactDOM.createPortal для рендеринга вне основного дерева компонентов
  return ReactDOM.createPortal(modalContent, document.body);
};

export default RentalFormModal;