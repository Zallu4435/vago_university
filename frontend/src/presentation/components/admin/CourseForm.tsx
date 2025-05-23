<select
  value={formData.specialization}
  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
>
  <option value="" className="bg-gray-900 text-gray-300">Select Specialization</option>
  {specializations
    .filter((spec) => spec !== 'All Specializations')
    .map((spec) => (
      <option key={spec} value={spec} className="bg-gray-900 text-gray-300">
        {spec}
      </option>
    ))}
</select>

<style jsx>{`
  /* ... existing styles ... */

  select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a855f7'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  select:focus {
    border-color: rgba(168, 85, 247, 0.5);
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.25);
  }

  select option {
    background-color: #1f2937;
    color: #e5e7eb;
  }

  select option:hover {
    background-color: #4b5563;
  }

  /* Style for the select when it's open */
  select:focus option:checked {
    background-color: #6b21a8;
    color: white;
  }
`}</style> 