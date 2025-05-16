'use client';

export default function FeatureItem({ icon, title, description }) {
  const renderIcon = () => {
    switch (icon) {
      case 'mountains':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 31.6667L20 11.6667L31.6667 31.6667H8.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33333 31.6667L10 21.6667L16.6667 31.6667H3.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21.6667 31.6667L30 18.3334L38.3333 31.6667H21.6667Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pool':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 18.3334C14.4281 18.3334 16.6667 16.0948 16.6667 13.3334C16.6667 10.572 14.4281 8.33337 11.6667 8.33337C8.90524 8.33337 6.66667 10.572 6.66667 13.3334C6.66667 16.0948 8.90524 18.3334 11.6667 18.3334Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M31.6667 21.6667V10.0001" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 21.6667V10.0001" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M31.6667 21.6667C31.6667 25.0204 30.1786 28.2364 27.5281 30.6119C24.8777 32.9873 21.3322 34.1667 17.7084 34.1667C14.0846 34.1667 10.539 32.9873 7.88861 30.6119C5.23818 28.2364 3.75 25.0204 3.75 21.6667" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'spa':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6667 30.0001C11.6667 27.2387 13.9053 25.0001 16.6667 25.0001C19.4281 25.0001 21.6667 27.2387 21.6667 30.0001C21.6667 32.7615 19.4281 35.0001 16.6667 35.0001C13.9053 35.0001 11.6667 32.7615 11.6667 30.0001Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.6667 25.0001C16.6667 20.0001 8.33333 15.0001 8.33333 10.0001C8.33333 5.00008 16.6667 5.00008 16.6667 10.0001" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.6667 10C16.6667 5 25 5 25 10C25 15 16.6667 20 16.6667 25" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'beach':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 35H35" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.33333 28.3334C11.0948 28.3334 13.3333 26.0948 13.3333 23.3334C13.3333 20.572 11.0948 18.3334 8.33333 18.3334C5.57191 18.3334 3.33333 20.572 3.33333 23.3334C3.33333 26.0948 5.57191 28.3334 8.33333 28.3334Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.3333 23.3334H18.3333" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M31.6667 23.3334L35 15.0001L30 5.00008L25 15.0001L28.3333 23.3334" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.3333 23.3334H31.6667" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.3333 23.3334C18.3333 26.0948 20.5719 28.3334 23.3333 28.3334C26.0947 28.3334 28.3333 26.0948 28.3333 23.3334" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.33333 28.3334V35.0001" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23.3333 28.3334V35.0001" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 31.6667L20 11.6667L31.6667 31.6667H8.33333Z" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-start mb-2">
        <div className="mr-4">
          {renderIcon()}
        </div>
        <div>
          {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}