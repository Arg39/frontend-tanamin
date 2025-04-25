import React, { useState } from "react";
import SearchFields from "./searchFields";
import Icon from "./icon-heroicons";

export default function FilterCard({ categories, course }) {
  const [checkedItemsCategory, setCheckedItemsCategory] = useState({});
  const [checkedItemsRating, setCheckedItemsRating] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const handleCheckboxChange = (index) => {
    setCheckedItemsCategory((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRadioChange = (index) => {
    setSelectedRating(index);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="w-full h-full bg-white-100 bg-white shadow-lg rounded-xl p-8 ">
      <SearchFields categories={categories} />
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">Kategori</h1>
        <hr className="my-4 border-t-2 border-gray-300" />
        <ul>
          {(showAll ? categories : categories.slice(0, 7)).map(
            (category, index) => (
              <li
                key={index}
                className="w-full flex justify-between items-center my-2"
              >
                <label
                  className={`w-full pr-1 flex items-center font-semibold text-lg truncate ${
                    checkedItemsCategory[index] ? "text-[#AF3910]" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={!!checkedItemsCategory[index]}
                    onChange={() => handleCheckboxChange(index)}
                    style={{
                      accentColor: checkedItemsCategory[index] ? "#AF3910" : "",
                    }}
                  />
                  {category.name}
                </label>
                <div className="p-1 px-3 bg-gray-200 rounded-md">
                  <span className="text-md font-semibold">
                    {course.lotMaterial}
                  </span>
                </div>
              </li>
            )
          )}
        </ul>
        {categories.length > 3 && (
          <button
            onClick={toggleShowAll}
            className="mt-4 text-[#AF3910] hover:underline font-bold"
          >
            {showAll ? "Lihat lebih sedikit" : "Lihat lebih"}
          </button>
        )}

        <h1 className="text-2xl mt-10 font-semibold">Ratings</h1>
        <hr className="my-4 border-t-2 border-gray-300" />
        <ul>
          {[...Array(5)].map((_, index) => (
            <li key={index} className="flex justify-between items-center my-2">
              <label
                className={`flex items-center font-semibold text-lg ${
                  selectedRating === index ? "text-[#AF3910]" : ""
                }`}
              >
                <input
                  type="radio"
                  className="mr-2 w-4 h-4"
                  checked={selectedRating === index}
                  onChange={() => handleRadioChange(index)}
                  style={{
                    accentColor: selectedRating === index ? "#AF3910" : "",
                  }}
                />{" "}
                {[...Array(5)].map((_, starIndex) => (
                  <Icon
                    key={starIndex}
                    type={"star"}
                    className={`h-6 w-6 ${
                      starIndex < 5 - index
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </label>
              <div className="p-1 px-3 bg-gray-200 rounded-md">
                <span className="text-md font-semibold">2</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
