const { nanoid } = require('nanoid');
const Books = require('./books');

// Kriteria 1
const addBooks = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const myBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  Books.push(myBook);
  const Success = Books.filter(b => b.id === id).length > 0;

  if (!name) { // if name doesn't exist
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response
  };
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response
  };
  if (Success) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response
  } // condition if failed to enter the book due to general reasons
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500);
  return response
};
// Akhir kriteria 1

// Kriteria 2
const getBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const book = Books
      .filter(filtering => filtering.name.toLowerCase().includes(name.toLowerCase()))
      .map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200);
    return response
  };
  if (reading !== undefined) {
    if (reading === '0') {
      return {
        status: 'success',
        data: {
          books:
            Books
              .filter(filtering => filtering.reading === false)
              .map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
              }))
        }
      }
    };
    if (reading === '1') {
      return {
        status: 'success',
        data: {
          books:
            Books
              .filter(filtering => filtering.reading === true)
              .map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
              }))
        }
      }
    }
    return {
      status: 'success',
      data: Books
        .map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
    }
  };
  if (finished !== undefined) {
    if (finished === '0') {
      return {
        status: 'success',
        data: {
          books:
            Books
              .filter(filtering => filtering.finished === false)
              .map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
              }))
        }
      }
    };
    if (finished === '1') {
      return {
        status: 'success',
        data: {
          books:
            Books
              .filter(filtering => filtering.finished === true)
              .map(book => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
              }))
        }
      }
    }
    return {
      status: 'success',
      data: Books
        .map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
    }
  }
  const response = h.response({
    status: 'success',
    data: {
      books: Books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200);
  return response
}
// Akhir kriteria 2

// Kriteria 3
const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = Books.filter(book => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200);
    return response
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404);
  return response
}
// Akhir kriteria 3

// Kriteria 4
const editBookById = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString();
  const index = Books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    Books[index] = {
      ...Books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response
  };
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400);
    return response
  };
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response
  };
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  });
  response.code(404);
  return response
}
// Akhir kriteria 4

// Kriteria 5
const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = Books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    Books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response
}
// Akhir kriteria 5

module.exports = { addBooks, getBooks, getBookById, editBookById, deleteBookById }