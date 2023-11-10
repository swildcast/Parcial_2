document.addEventListener('DOMContentLoaded', async function () {
    await getBooksRequest();

    const saveBookButton = document.getElementById('saveBookButton');
    saveBookButton.addEventListener('click', async function () {
        const bookTitle = document.getElementById('title').value;
        const bookAuthor = document.getElementById('author').value;
        const bookGenre = document.getElementById('genre').value;
        const bookprecio = document.getElementById('precio').value;
        const booknpages = document.getElementById('npages').value;
        const bookestado = document.getElementById('estado').checked;

        if (!bookTitle || !bookAuthor || !bookGenre || !bookprecio || !booknpages) {
            alert('Por favor, complete todos los campos antes de guardar el libro.');
            return;
        }

        await saveBookRequest({ bookTitle, bookAuthor, bookGenre, bookprecio, booknpages, bookestado });
    });

    const updateBookButton = document.getElementById('updateBookButton');
    updateBookButton.addEventListener('click', async function () {
        const bookID = document.getElementById('editBookId').value;
        const bookTitle = document.getElementById('editTitle').value;
        const bookAuthor = document.getElementById('editAuthor').value;
        const bookGenre = document.getElementById('editGenre').value;
        const bookprecio = document.getElementById('editprecio').value;
        const booknpages = document.getElementById('editnpages').value;
        const bookestado = document.getElementById('editestado').checked;

        if (!bookTitle || !bookAuthor || !bookGenre || !bookprecio || !booknpages) {
            alert('Por favor, complete todos los campos antes de actualizar el libro.');
            return;
        }

        await updateBookRequest({ bookID, bookTitle, bookGenre, bookAuthor, bookprecio, booknpages, bookestado });
    });

    const deleteBookButton = document.getElementById('deleteBookButton');
    deleteBookButton.addEventListener('click', async function () {
        const bookId = document.getElementById('deleteBookID').innerHTML;
        await deleteBookRequest(bookId);

    const detailsBookButtons = document.getElementById('detailsbookbutton');
    detailsBookButtons.addEventListener('click', async function() {
        const bookId = button.getElementById('bookDetailsContent');
        await showBookDetails(bookId);
            });
       });
});

function showBooks(books) {
    let arrayBooks = '';
    if (!!books && books.length > 0) {
        books.forEach(book => {
            arrayBooks += `<tr>
                <td scope="row">${book.id}</td>
                <td>${book.title}</td>
                <td>${book.genre}</td>
                <td>${book.author}</td>
                <td>${book.precio}</td>
                <td>${book.npages}</td>
                <td>${book.estado ? 'Checked' : 'Unchecked'}</td>
                

                <td>
                    <button type="button" class="btn btn-outline-success" onclick="editBook('${book.id}', '${book.title}', '${book.genre}', '${book.author}')">
                        <i class="bi bi-pencil"></i> <!-- Ícono de lápiz -->
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-outline-danger" onclick="deleteBook('${book.id}', '${book.title}')">
                        <i class="bi bi-trash"></i> <!-- Ícono de caneca -->
                    </button>
                 </td>   
                <td>    
                    <button type="button" class="btn btn-outline-primary details-book-button" onclick="bookDetails('${book.id}')">
                        <i class="bi bi-info"></i> <!-- Ícono de información -->
                    </button>
                </td>
            </tr>`;
        });
    } else {
        arrayBooks = `<tr class="table-warning">
            <td colspan="6" class="text-center">No hay libros</td>
        </tr>`;
    }

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = arrayBooks;
}

async function getBooksRequest() {
    try {
        let response = await fetch('http://localhost:3000/books');
        let data = await response.json();
        showBooks(data);
    } catch (error) {
        console.log(error);
        showBooks(null);
    }
}

async function saveBookRequest({ bookTitle, bookAuthor, bookGenre, bookprecio, booknpages, bookestado }) {
    try {
        let request = await fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                title: bookTitle,
                author: bookAuthor,
                genre: bookGenre,
                precio: bookprecio,
                npages: booknpages,
                estado: bookestado
            })
        });
        let data = await request.json();

        if (data.ok) {
            alert('Libro creado exitosamente');
            hideModal('bookModal');
            location.reload();
        } else {
            alert('No se pudo crear el libro');
        }
    } catch (error) {
        alert('ERROR');
    }
}

async function updateBookRequest({ bookID, bookTitle, bookGenre, bookAuthor, bookprecio, booknpages, bookestado }) {
    try {
        let request = await fetch(`http://localhost:3000/books/${bookID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: bookTitle,
                author: bookAuthor,
                genre: bookGenre,
                precio: bookprecio,
                npages: booknpages,
                estado: bookestado
            })
        });
        const data = await request.json();

        if (data.ok) {
            alert('Libro actualizado con éxito');
            hideModal('editBookModal');
            location.reload();
        } else {
            alert('No se pudo actualizar el libro');
        }
    } catch (error) {
        alert('ERROR');
    }
}

function editBook(id, title, genre, author, precio, npages, estado) {
    document.getElementById('editBookId').value = id;
    document.getElementById('editTitle').value = title;
    document.getElementById('editGenre').value = genre;
    document.getElementById('editAuthor').value = author;
    document.getElementById('editprecio').value = precio;
    document.getElementById('editnpages').value = npages;
    document.getElementById('editestado').checked = estado;
    showModal('editBookModal');
}

function deleteBook(id, title) {
    document.getElementById('deleteBookID').innerHTML = id;
    document.getElementById('deleteBookTitle').innerHTML = title;
    showModal('deleteBookModal');
}

async function deleteBookRequest(id) {
    try {
        let request = await fetch(`http://localhost:3000/books/${id}`, {
            'method': 'DELETE'
        });
        let data = await request.json();
        if (data.ok) {
            alert('Libro eliminado correctamente');
            hideModal('deleteBookModal');
            location.reload();
        } else {
            alert('Eliminación fallida del libro');
        }
    } catch (error) {
        alert('ERROR');
    }
}



function showBook(book) {
    const bookDetailsContent = document.getElementById('detalle');
    bookDetailsContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <div class="card mb-3" style="max-width: 440px;">
                    <div class="row g-0 h-100 w-100">
                        <div class="col-md-4">
                        <img src="${book.imgURL}" class="img-fluid rounded-start h-100 w-100" alt="${book.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.author}</p>
                                <p class="card-text"><small class="text-muted">${book.genre}</small></p>
                                <p class="card-text"><small class="text-muted">${book.precio}</small></p>
                                <p class="card-text"><small class="text-muted">${book.npages}</small></p>
                                <p class="card-text"><small class="text-muted">${book.estado}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

async function bookDetails(id) {
    try {
        let request = await fetch(`http://localhost:3000/books/${id}`, {
            method: 'GET'
        });
        let data = await request.json();
        if (data.ok) {
            alert('Book GET successfully');
            showBook(data.book);
            showModal('bookDetailsModal');
        } else {
            alert('Failed book GETING');
        }
    } catch (error) {
        console.log(error);
        alert('ERROR');
    }
}

function showModal(idModal) {
    const myModal = new bootstrap.Modal(`#${idModal}`, {
        keyboard: false
    });
    myModal.show();
}

function hideModal(modalId) {
    const existingModal = document.getElementById(modalId);
    const modal = new bootstrap.Modal(existingModal);
    modal.hide();
}
