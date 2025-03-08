import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoSource }) => {
  const videoRef = useRef(null);
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  // Отслеживаем изменение ориентации
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Обработка автовоспроизведения
  useEffect(() => {
    if (isOpen && videoRef.current) {
      const playVideo = async () => {
        try {
          videoRef.current.muted = true; // Сначала включаем режим без звука
          await videoRef.current.play();
          videoRef.current.muted = false; // После успешного запуска включаем звук
        } catch (error) {
          console.log('Автовоспроизведение не поддерживается');
        }
      };
      playVideo();
    }
  }, [isOpen]);

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
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    animation: 'fadeIn 0.3s ease-out'
  };

  const modalStyles = {
    position: 'relative',
    width: '90%',
    maxWidth: '1000px',
    backgroundColor: '#262626',
    borderRadius: isLandscape ? '0' : '16px',
    overflow: 'hidden',
    animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    ...(isLandscape && {
      height: '90vh', // Ограничиваем высоту в ландшафтной ориентации
      display: 'flex',
      alignItems: 'center'
    })
  };

  const closeButtonStyles = {
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    padding: '8px'
  };

  const videoContainerStyles = {
    width: '100%',
    height: isLandscape ? '100%' : 'auto',
    position: 'relative',
    ...(isLandscape ? {
      paddingTop: 0
    } : {
      paddingTop: '56.25%' // 16:9 только для портретной ориентации
    })
  };

  const videoStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    backgroundColor: '#000',
    ...(isLandscape && {
      objectFit: 'contain' // Сохраняем пропорции в ландшафтной ориентации
    })
  };

  // Определения для анимаций
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <div style={overlayStyles} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{animations}</style>
      <div style={modalStyles}>
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
          <X size={28} strokeWidth={2.5} />
        </button>

        <div style={videoContainerStyles}>
          <video
            ref={videoRef}
            style={videoStyles}
            controls
            playsInline
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={videoSource} type="video/webm" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;