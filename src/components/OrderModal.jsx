import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ErrorAlert from './ErrorAlert';

const OrderModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState({
    isOpen: false,
    message: ''
  });

  // Генерация временных слотов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setTimeSlots(generateTimeSlots());
      // Сбрасываем форму при каждом открытии
      setFormData({
        name: '',
        phone: '',
        callTime: ''
      });
    }
  }, [isOpen]);

  // Функция генерации временных слотов
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

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Получаем только цифры из телефона
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    // Простая валидация телефона
    if (cleanPhone.length < 10) {
      // Показываем кастомное сообщение об ошибке
      setError({
        isOpen: true,
        message: 'Пожалуйста, введите корректный номер телефона (не менее 10 цифр)'
      });
      return;
    }
    
    // Форматируем телефон для отправки
    const formattedPhone = '+7 ' + formData.phone;
    
    // Подготавливаем данные для отправки
    const submitData = {
      ...formData,
      phone: formattedPhone,
      product: {
        name: product.name,
        height: product.height,
        price: product.price
      }
    };
    
    // Здесь можно добавить логику отправки данных
    console.log('Отправляем данные:', submitData);
    
    // Имитация успешной отправки
    setError({
      isOpen: true,
      message: 'Спасибо за заказ! Мы свяжемся с вами в ближайшее время.'
    });
    
    // После закрытия оповещения закрываем модальное окно
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  // Закрытие окна с ошибкой
  const closeErrorAlert = () => {
    setError({
      isOpen: false,
      message: ''
    });
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '2rem'
  };

  const modalStyles = {
    background: '#262626',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    padding: '2.5rem',
    color: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  };

  const headingStyles = {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#fff',
    textAlign: 'center'
  };

  const productInfoStyles = {
    display: 'flex',
    gap: '15px',
    marginBottom: '1.5rem',
    background: 'rgba(0,0,0,0.2)',
    padding: '15px',
    borderRadius: '8px'
  };

  const productImageStyles = {
    width: '90px',
    height: '90px',
    minWidth: '90px',
    borderRadius: '6px',
    overflow: 'hidden',
    background: '#1a1a1a',
    border: '1px solid #333'
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const productDetailsStyles = {
    flex: 1
  };

  const productNameStyles = {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '5px',
    color: '#fff'
  };

  const productParamsStyles = {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: 1.5
  };

  const noteStyles = {
    fontSize: '0.9rem',
    color: '#ccc',
    marginBottom: '1.5rem'
  };

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const formGroupStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyles = {
    color: '#ccc',
    fontSize: '0.9rem'
  };

  const inputStyles = {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '1rem'
  };

  const buttonStyles = {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: 'var(--color-primary, #0066cc)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px'
  };

  return (
    <>
      <div 
        style={overlayStyles} 
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div style={modalStyles}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 2,
              transition: 'all 0.3s ease',
              padding: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <h2 style={headingStyles}>Оформление заказа</h2>

          {/* Информация о товаре */}
          <div style={productInfoStyles}>
            {product.image && (
              <div style={productImageStyles}>
                <img src={product.image} alt={product.name} style={imageStyles} />
              </div>
            )}
            <div style={productDetailsStyles}>
              <p style={productNameStyles}>{product.name}</p>
              <p style={productParamsStyles}>
                Рост: {product.height}
                <br />
                Цена: {product.price.toLocaleString('ru-RU')} руб.
              </p>
            </div>
          </div>

          <p style={noteStyles}>
            Мы свяжемся с вами в указанное вами время по указанному вами номеру телефона для уточнения деталей заказа.
          </p>
              
          <form style={formStyles} onSubmit={handleSubmit}>
            <div style={formGroupStyles}>
              <label htmlFor="name" style={labelStyles}>Ваше имя:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={inputStyles}
              />
            </div>
              
            <div style={formGroupStyles}>
              <label htmlFor="phone" style={labelStyles}>Телефон:</label>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '15px',
                  color: '#fff'
                }}>+7 </span>
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
                    paddingLeft: '40px'
                  }}
                />
              </div>
            </div>
              
            <div style={formGroupStyles}>
              <label htmlFor="callTime" style={labelStyles}>Удобное время для звонка:</label>
              <select 
                id="callTime" 
                name="callTime" 
                value={formData.callTime} 
                onChange={handleChange} 
                required
                style={{...inputStyles, appearance: 'none'}}
              >
                <option value="">Выберите время</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
              
            <button 
              type="submit" 
              style={buttonStyles}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent, #0056b3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary, #0066cc)';
              }}
            >
              Отправить
            </button>
          </form>
        </div>
      </div>

      {/* Кастомное модальное окно для ошибок */}
      <ErrorAlert 
        isOpen={error.isOpen}
        onClose={closeErrorAlert}
        message={error.message}
      />
    </>
  );
};

export default OrderModal;