import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const OrderModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    callTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Здесь можно добавить логику отправки данных
    console.log('Отправляем данные:', { ...formData, product });
    
    // Имитация успешной отправки
    alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
    onClose();
  };

  // Блокировка прокрутки страницы при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Закрытие модального окна по клавише Esc
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-content">
          <h3 className="modal-title">Оформление заказа</h3>
          
          <div className="modal-product-info">
            <div className="product-info-container">
              {product.image && (
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
              )}
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-params">
                  Рост: {product.height}
                  <br />
                  Цена: {product.price.toLocaleString('ru-RU')} руб.
                </p>
              </div>
            </div>
          </div>
          
          <p className="modal-note">
            Мы свяжемся с вами в течение 24 часов для подтверждения и уточнения деталей заказа, 
            по указанным вами контактам.
          </p>
            
          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Ваше имя:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Телефон:</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="+7 (___) ___-__-__" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="callTime">Удобное время для звонка:</label>
              <input 
                type="text" 
                id="callTime" 
                name="callTime" 
                value={formData.callTime} 
                onChange={handleChange} 
                placeholder="Например: после 18:00" 
              />
            </div>
            
            <button type="submit" className="submit-btn">Отправить</button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-container {
          background: #262626;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid #333;
        }
        
        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.3);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s ease;
        }
        
        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.6);
          transform: rotate(90deg);
        }
        
        .modal-content {
          padding: 30px;
        }
        
        .modal-title {
          text-align: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #fff;
        }
        
        .modal-product-info {
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          color: #fff;
        }
        
        .product-info-container {
          display: flex;
          gap: 15px;
        }
        
        .product-image {
          width: 90px;
          height: 90px;
          min-width: 90px;
          border-radius: 6px;
          overflow: hidden;
          background: #1a1a1a;
          border: 1px solid #333;
        }
        
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-details {
          flex: 1;
        }
        
        .product-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #fff;
        }
        
        .product-params {
          color: #ccc;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        
        .modal-note {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 20px;
        }
        
        .order-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .form-group label {
          color: #ccc;
          font-size: 0.9rem;
        }
        
        .form-group input {
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #444;
          background: #1a1a1a;
          color: #fff;
          font-size: 1rem;
        }
        
        .form-group input:focus {
          border-color: var(--color-primary, #0066cc);
          outline: none;
        }
        
        .submit-btn {
          background: var(--color-primary, #0066cc);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          margin-top: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
          background: var(--color-accent, #0056b3);
        }
        
        @media (max-width: 768px) {
          .modal-container {
            max-width: 100%;
          }
          
          .modal-content {
            padding: 20px 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderModal;