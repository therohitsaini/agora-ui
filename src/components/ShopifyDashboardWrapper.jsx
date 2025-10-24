import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShopifyDashboardWrapper = ({ children }) => {
  const [isShopifyReady, setIsShopifyReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkShopifyReady = () => {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 30; // Reduced from 50 to 30

        const check = () => {
          attempts++;
          if (window.shopify && window.shopify.idToken) {
            resolve(true);
          } else if (attempts >= maxAttempts) {
            console.warn('Shopify App Bridge not ready after timeout - proceeding anyway');
            resolve(false);
          } else {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
              setTimeout(check, 200); // Increased interval
            });
          }
        };

        check();
      });
    };

    const initializeDashboard = async () => {
      try {
        const ready = await checkShopifyReady();
        if (ready) {
          console.log('Shopify App Bridge is ready for dashboard');
          setIsShopifyReady(true);
        } else {
          console.warn('Proceeding without Shopify App Bridge');
          setIsShopifyReady(true);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setIsShopifyReady(true); // Proceed anyway
      }
    };

    initializeDashboard();
  }, []);

  // Show loading state while Shopify initializes
  if (!isShopifyReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>
          Initializing Shopify App Bridge...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default ShopifyDashboardWrapper;
