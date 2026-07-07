import { db } from "@/lib/db";
import { addBook, issueBook, returnBook } from "./actions";

// Next.js allows us to read the URL search bar directly!
export default async function LibraryPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q || "";

  // 1. Stats Queries
  const [totalBooks]: any = await db.execute("SELECT COUNT(*) as count FROM book");
  const [activeLoans]: any = await db.execute("SELECT COUNT(*) as count FROM libraryborrow WHERE returnDate IS NULL");
  const [overdue]: any = await db.execute("SELECT * FROM libraryborrow WHERE returnDate IS NULL AND dueDate < NOW()");

  // 2. Fetch Lists (Notice the ORDER BY title ASC for the dropdown!)
  const [allBooks]: any = await db.execute("SELECT * FROM book ORDER BY title ASC");
  const [loans]: any = await db.execute("SELECT lb.*, b.title FROM libraryborrow lb JOIN book b ON lb.bookId = b.id WHERE lb.returnDate IS NULL");

  // 3. Filter the inventory if the user typed in the search bar
  let inventory = allBooks;
  if (query) {
    inventory = allBooks.filter((b: any) => 
      b.title.toLowerCase().includes(query.toLowerCase()) || 
      b.author.toLowerCase().includes(query.toLowerCase())
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <p className="text-slate-400 font-bold uppercase text-[10px]">Total Books</p>
           <p className="text-3xl font-black text-slate-800">{totalBooks[0].count}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <p className="text-slate-400 font-bold uppercase text-[10px]">Active Loans</p>
           <p className="text-3xl font-black text-indigo-600">{activeLoans[0].count}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <p className="text-slate-400 font-bold uppercase text-[10px]">Overdue Items</p>
           <p className="text-3xl font-black text-rose-600">{overdue.length}</p>
        </div>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expanded Add Book Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="font-black text-slate-800 mb-4">Add New Book</h2>
          <form action={addBook} className="grid grid-cols-2 gap-4">
             <input name="title" placeholder="Book Title" className="p-2 border border-slate-200 bg-slate-50 rounded-lg col-span-2" required />
             <input name="author" placeholder="Author" className="p-2 border border-slate-200 bg-slate-50 rounded-lg" required />
             <input name="isbn" placeholder="ISBN" className="p-2 border border-slate-200 bg-slate-50 rounded-lg" />
             <input name="stockQuantity" type="number" placeholder="Quantity (e.g., 5)" className="p-2 border border-slate-200 bg-slate-50 rounded-lg" required />
             <input name="location" placeholder="Shelf (e.g., Shelf A)" className="p-2 border border-slate-200 bg-slate-50 rounded-lg" required />
             <button className="bg-slate-900 text-white font-bold p-3 rounded-lg col-span-2 hover:bg-slate-800 transition">Add Book to Inventory</button>
          </form>
        </div>

        {/* Sorted Issue Book Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="font-black text-slate-800 mb-4">Issue Book</h2>
            <form action={issueBook} className="grid grid-cols-1 gap-4">
              <input name="studentRoll" placeholder="Student ID (e.g., CSE1212201)" className="p-2 border border-slate-200 bg-slate-50 rounded-lg" required />
              
              {/* Dropdown is now alphabetical! */}
              <select name="bookId" className="p-2 border border-slate-200 bg-slate-50 rounded-lg cursor-pointer" required>
                  <option value="">Select a book...</option>
                  {allBooks.map((b: any) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
              
              <button className="bg-emerald-600 text-white font-bold p-3 rounded-lg hover:bg-emerald-700 transition mt-2">Issue Book</button>
            </form>
          </div>
        </div>
      </div>

      {/* Active Loans List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <h2 className="p-6 font-black text-slate-800 border-b border-slate-100">Current Loans & Overdue</h2>
        <table className="w-full text-left text-sm">
           <tbody>
           {loans.map((loan: any) => (
             <tr key={loan.id} className="border-b border-slate-50 hover:bg-slate-50">
               <td className="p-4 font-bold text-slate-800">{loan.title}</td>
               <td className="p-4 text-slate-500">{loan.institutionalRoll}</td>
               <td className="p-4 font-bold text-rose-600">Due: {new Date(loan.dueDate).toLocaleDateString()}</td>
               <td className="p-4 text-right">
                  <form action={returnBook}>
                    <input type="hidden" name="id" value={loan.id} />
                    <button className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-md hover:bg-slate-200 transition">Return Book</button>
                  </form>
               </td>
             </tr>
           ))}
           </tbody>
        </table>
      </div>

      {/* COMPLETE INVENTORY WITH SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-8 shadow-sm">
        <div className="p-6 flex flex-col md:flex-row justify-between md:items-center bg-slate-50 border-b border-slate-200 gap-4">
          <h2 className="font-black text-slate-800">Complete Inventory Directory</h2>
          
          {/* URL-based Search Form */}
          <form method="GET" className="flex gap-2 w-full md:w-auto">
            <input 
              name="q" 
              defaultValue={query} 
              placeholder="Search title or author..." 
              className="p-2 border border-slate-200 rounded-lg text-sm w-full md:w-64" 
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700">Search</button>
          </form>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
             {inventory.map((book: any) => (
                <tr key={book.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-800">{book.title}</td>
                  <td className="p-4 text-slate-600">{book.author}</td>
                  <td className="p-4 text-slate-500 text-xs">{book.location}</td>
                  <td className="p-4 font-mono text-center">{book.stockQuantity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                      book.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                </tr>
             ))}
             {inventory.length === 0 && (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">No books found matching your search.</td>
               </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
}