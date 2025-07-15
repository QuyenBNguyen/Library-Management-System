// File: frontend/src/data/mockData.js

const collectionsByCategory = [
  {
    category: "Editor's Picks",
    books: [
      { 
        id: 'dac-nhan-tam', title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', 
        imageUrl: 'https://i.pinimg.com/1200x/1c/22/df/1c22df7132ad8f1358688b23831e9eaf.jpg', 
        price: 89000, status: 'Available', rating: 4.8, totalRatings: 1250, 
        quote: "“The only way on earth to influence other people is to talk about what they want and show them how to get it.”",
        description: "Dale Carnegie's rock-solid, time-tested advice has carried countless people up the ladder of success in their business and personal lives. It is one of the most influential self-help classics ever written.\n\nThis book provides timeless principles on how to handle people, communicate effectively, and build strong relationships. Through real-life stories and insightful advice, Carnegie explains how to make people like you and win them to your way of thinking.", 
        reviews: [{ user: 'An Nguyen', stars: 5, comment: 'Cuốn sách thay đổi cuộc đời mình, nên đọc!' },{ user: 'Binh Le', stars: 4, comment: 'Nhiều lời khuyên hữu ích.' }]
      },
      { 
        id: 'nha-gia-kim', title: 'The Alchemist', author: 'Paulo Coelho', 
        imageUrl: 'https://i.pinimg.com/736x/d6/fe/7a/d6fe7a345fae0de4a2d9e86d1a181c62.jpg', 
        price: 79000, status: 'Checked Out', rating: 4.7, totalRatings: 2100,
        quote: "“And, when you want something, all the universe conspires in helping you to achieve it.”",
        description: "The Alchemist tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest leads him to riches far different—and far more satisfying—than he ever imagined.\n\nSantiago's journey teaches us about the essential wisdom of listening to our hearts, of recognizing opportunity and learning to read the omens strewn along life's path, and, most importantly, to follow our dreams.",
        reviews: [{ user: 'Chi Mai', stars: 5, comment: 'Một câu chuyện tuyệt vời, đầy triết lý.' }]
      },
    ]
  },
  {
    category: 'Classics & Literature',
    books: [
       { 
        id: 'hoang-tu-be', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry', 
        imageUrl: 'https://i.pinimg.com/736x/73/fe/f2/73fef2d17b9f311e713bee4bcba584d7.jpg', 
        price: 59000, status: 'Available', rating: 4.9, totalRatings: 3500,
        quote: "“It is only with the heart that one can see rightly; what is essential is invisible to the eye.”",
        description: "A pilot stranded in the desert awakes one morning to see a most extraordinary little fellow. The pilot's strange new friend tells him of his journey to Earth from a distant planet, a story that explores themes of loneliness, friendship, love, and loss.\n\nBeneath its simple surface, it is a profound and deeply moving fable about the human condition.",
        reviews: [{ user: 'Duy Anh', stars: 5, comment: 'Câu chuyện giản dị nhưng vô cùng sâu sắc.' }]
      },
      { 
        id: 'khong-gia-dinh', title: 'Nobody\'s Boy', author: 'Hector Malot', 
        imageUrl: 'https://i.pinimg.com/1200x/42/66/87/42668721450f1854c0634e6a765ee821.jpg', 
        price: 115000, status: 'Available', rating: 4.9, totalRatings: 4500,
        quote: "“It is necessary to have a large heart to be able to contain all the misfortunes of others.”",
        description: "A classic of French literature, this novel tells the adventurous life of Remi, an orphan sold to a traveling musician. Together with his small troupe, Remi travels across France, facing countless hardships and challenges while always maintaining a kind heart and belief in life.",
        reviews: [{ user: 'Minh Tuấn', stars: 5, comment: 'Tuổi thơ của tôi!' }]
      },
    ]
  }
];

const allBooks = collectionsByCategory.flatMap(collection => collection.books);
const booksDataMap = new Map(allBooks.map(book => [book.id, book]));

export const findBookById = (bookId) => booksDataMap.get(bookId);
export { collectionsByCategory, allBooks };