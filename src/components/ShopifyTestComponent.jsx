import { useEffect, useState } from 'react';

const ShopifyTestComponent = () => {
  const [shopifyStatus, setShopifyStatus] = useState({
    isLoaded: false,
    hasToken: false,
    methods: []
  });

  useEffect(() => {
    const checkShopifyStatus = () => {
      const isLoaded = typeof window.shopify !== 'undefined' && window.shopify;
      const hasToken = !!window.sessionToken;
      const methods = isLoaded ? Object.keys(window.shopify) : [];

      setShopifyStatus({
        isLoaded,
        hasToken,
        methods
      });
    };

    // Check immediately
    checkShopifyStatus();

    // Check periodically
    const interval = setInterval(checkShopifyStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const testToast = () => {
    if (window.flashNotice) {
      window.flashNotice('Test message from Shopify App Bridge!');
    } else {
      alert('Shopify App Bridge not available');
    }
  };

  const testToken = async () => {
    if (window.shopify && window.shopify.idToken) {
      try {
        const token = await window.shopify.idToken();
        console.log('Retrieved token:', token);
        alert('Token retrieved successfully! Check console for details.');
      } catch (error) {
        console.error('Error retrieving token:', error);
        alert('Error retrieving token: ' + error.message);
      }
    } else {
      alert('Shopify App Bridge not available');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Shopify App Bridge Status</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Status:</strong> 
        <span style={{ 
          color: shopifyStatus.isLoaded ? 'green' : 'red',
          marginLeft: '5px'
        }}>
          {shopifyStatus.isLoaded ? '✓ Loaded' : '✗ Not Loaded'}
        </span>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Token:</strong> 
        <span style={{ 
          color: shopifyStatus.hasToken ? 'green' : 'orange',
          marginLeft: '5px'
        }}>
          {shopifyStatus.hasToken ? '✓ Available' : '⚠ Not Available'}
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Methods:</strong> 
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {shopifyStatus.methods.length > 0 ? 
            shopifyStatus.methods.join(', ') : 
            'None available'
          }
        </div>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <button 
          onClick={testToast}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Toast
        </button>
        
        <button 
          onClick={testToken}
          style={{
            padding: '5px 10px',
            fontSize: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Token
        </button>
      </div>
    </div>
  );
};

export default ShopifyTestComponent;
