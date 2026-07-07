'use client';

import { useState } from 'react';
import { Monitor, Microscope, AlertCircle, Box, X } from 'lucide-react';
import { addAsset, updateStatus } from './actions';

export default function InventoryClient({ items, stats }: { items: any[], stats: any }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Asset & Inventory Management</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
        >
          + Add New Asset
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">IT & Computers</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{stats.it}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Monitor size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Lab Equipment</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{stats.lab}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Microscope size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Needs Maintenance</p>
            <h3 className="text-3xl font-black text-rose-600 mt-2">{stats.maintenance}</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><AlertCircle size={24} /></div>
        </div>
      </div>

      {/* Dynamic Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">High-Value Engineering Assets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Item Name</th>
                <th className="p-4 font-bold">SKU / Asset ID</th>
                <th className="p-4 font-bold">Department</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                    <Box size={16} className="text-slate-400"/> {item.item_name}
                  </td>
                  <td className="p-4 text-slate-500">{item.sku}</td>
                  <td className="p-4">{item.department}</td>
                  <td className="p-4">
                    {/* INLINE EDITING LOGIC */}
                    {editingId === item.id ? (
                      <form action={async (formData) => {
                        await updateStatus(formData);
                        setEditingId(null);
                      }} className="flex gap-2 items-center">
                        <input type="hidden" name="id" value={item.id} />
                        <select name="status" defaultValue={item.status} className="border border-slate-300 p-1 rounded text-xs bg-white">
                          <option value="Active">Active</option>
                          <option value="In Use">In Use</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                        <button type="submit" className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-indigo-700">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-slate-500 text-xs hover:text-slate-800">Cancel</button>
                      </form>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Maintenance' ? 'bg-rose-100 text-rose-700' : 
                        item.status === 'In Use' ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId !== item.id && (
                      <button onClick={() => setEditingId(item.id)} className="text-indigo-600 font-bold hover:underline">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD NEW ASSET MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add New Asset</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form action={async (formData) => {
              await addAsset(formData);
              setIsAddModalOpen(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Item Name</label>
                <input type="text" name="item_name" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-indigo-500" placeholder="e.g., Oscilloscope" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU / ID</label>
                <input type="text" name="sku" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-indigo-500" placeholder="e.g., CMSIL-EEE-001" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                <input type="text" name="department" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-indigo-500" placeholder="e.g., EEE Dept" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                <select name="status" className="w-full border border-slate-200 rounded-lg p-2 focus:outline-indigo-500">
                  <option value="Active">Active</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 font-bold rounded-lg hover:bg-indigo-700">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}