// MongoDB Book Collection Utilities

// Find all books in a specific genre
const findByGenre = async (db, genre) => {
  try {
    return await db.collection('books').find({ genre }, {
      projection: { title: 1, author: 1, price: 1, _id: 0 }
    }).toArray();
  } catch (err) {
    console.error("Error in findByGenre:", err);
    throw err;
  }
};

// Find books published after a certain year
const findByPublicationYear = async (db, year) => {
  try {
    return await db.collection('books').find(
      { published_year: { $gt: year } },
      { projection: { title: 1, author: 1, published_year: 1, price: 1, _id: 0 } }
    ).toArray();
  } catch (err) {
    console.error("Error in findByPublicationYear:", err);
    throw err;
  }
};

// Find books by a specific author
const findByAuthor = async (db, author) => {
  try {
    return await db.collection('books').find({ author }, {
      projection: { title: 1, published_year: 1, price: 1, _id: 0 }
    }).toArray();
  } catch (err) {
    console.error("Error in findByAuthor:", err);
    throw err;
  }
};

// Update the price of a specific book
const updatePrice = async (db, title, newPrice) => {
  try {
    if (typeof newPrice !== 'number' || newPrice < 0) {
      throw new Error("Invalid price value");
    }
    return await db.collection('books').updateOne(
      { title },
      { $set: { price: newPrice } }
    );
  } catch (err) {
    console.error("Error in updatePrice:", err);
    throw err;
  }
};

// Delete a book by its title
const deleteBook = async (db, title) => {
  try {
    return await db.collection('books').deleteOne({ title });
  } catch (err) {
    console.error("Error in deleteBook:", err);
    throw err;
  }
};

// Find books in stock and published after a certain year
const findInStockAfterYear = async (db, year) => {
  try {
    return await db.collection('books').find(
      { in_stock: true, published_year: { $gt: year } },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
  } catch (err) {
    console.error("Error in findInStockAfterYear:", err);
    throw err;
  }
};

// Sort books by price ascending
const sortByPriceAscending = async (db) => {
  try {
    return await db.collection('books').find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).sort({ price: 1 }).toArray();
  } catch (err) {
    console.error("Error in sortByPriceAscending:", err);
    throw err;
  }
};

// Sort books by price descending
const sortByPriceDescending = async (db) => {
  try {
    return await db.collection('books').find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).sort({ price: -1 }).toArray();
  } catch (err) {
    console.error("Error in sortByPriceDescending:", err);
    throw err;
  }
};

// Paginate books - 5 per page
const paginateBooks = async (db, page = 1) => {
  try {
    const limit = 5;
    const skip = (page - 1) * limit;
    if (page < 1) throw new Error("Page number must be >= 1");

    return await db.collection('books').find(
      {},
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).skip(skip).limit(limit).toArray();
  } catch (err) {
    console.error("Error in paginateBooks:", err);
    throw err;
  }
};

// Get average price of books by genre
const avgPriceByGenre = async (db) => {
  try {
    return await db.collection('books').aggregate([
      { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
      { $sort: { _id: 1 } }
    ]).toArray();
  } catch (err) {
    console.error("Error in avgPriceByGenre:", err);
    throw err;
  }
};

// Find the author with the most books
const authorWithMostBooks = async (db) => {
  try {
    const result = await db.collection('books').aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();

    return result[0] || null;
  } catch (err) {
    console.error("Error in authorWithMostBooks:", err);
    throw err;
  }
};

// Group books by publication decade
const booksByDecade = async (db) => {
  try {
    return await db.collection('books').aggregate([
      {
        $project: {
          decade: {
            $subtract: ["$published_year", { $mod: ["$published_year", 10] }]
          }
        }
      },
      {
        $group: {
          _id: "$decade",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
  } catch (err) {
    console.error("Error in booksByDecade:", err);
    throw err;
  }
};

// Create index on title
const createTitleIndex = async (db) => {
  try {
    return await db.collection('books').createIndex({ title: 1 });
  } catch (err) {
    console.error("Error in createTitleIndex:", err);
    throw err;
  }
};

// Create compound index on author and published_year
const createAuthorYearIndex = async (db) => {
  try {
    return await db.collection('books').createIndex({ author: 1, published_year: 1 });
  } catch (err) {
    console.error("Error in createAuthorYearIndex:", err);
    throw err;
  }
};

// Export all functions
module.exports = {
  findByGenre,
  findByPublicationYear,
  findByAuthor,
  updatePrice,
  deleteBook,
  findInStockAfterYear,
  sortByPriceAscending,
  sortByPriceDescending,
  paginateBooks,
  avgPriceByGenre,
  authorWithMostBooks,
  booksByDecade,
  createTitleIndex,
  createAuthorYearIndex
};
