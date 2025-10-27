import React from 'react'

function Shopifytest() {
  const cards = [
    {
      id: 1,
      title: "Card 1",
      description: "This is the first card description",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Card 2", 
      description: "This is the second card description",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Card 3",
      description: "This is the third card description", 
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={card.image} 
            alt={card.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Shopifytest