import React from "react";

export default function SearchUser({ searchKey, setSearchKey }) {
  return (
    <div>
      <input
        className="input-search"
        placeholder="Tìm kiếm"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
    </div>
  );
}
