import React, { useState } from 'react';
import Checkbox from '../form/checkbox';
import StarRating from '../content/star/star';

const categories = [
  { id: 'all-categories', title: 'semua', count: 7 },
  { id: '1231-32cas', title: 'Programming', count: 3 },
  { id: '12sa-sad22', title: 'Design', count: 2 },
  { id: 'sd823-123zd', title: 'Marketing', count: 2 },
];

const instructor = [
  { id: 'all-instructor', name: 'semua', count: 21 },
  { id: '123sa-6745d', name: 'Angra blastsada', count: 7 },
  { id: 'sd12sd-232da', name: 'bras', count: 7 },
  { id: 'dasd92-3cs12', name: 'vasterio', count: 7 },
];

const rating = [
  { rating: 5, count: 17 },
  { rating: 4, count: 2 },
  { rating: 3, count: 4 },
  { rating: 2, count: 3 },
  { rating: 1, count: 2 },
];

const price = [
  { title: 'semua', type: 'all', count: 21 },
  { title: 'gratis', type: 'free', count: 8 },
  { title: 'berbayar', type: 'paid', count: 13 },
];

const level = [
  { title: 'semua', type: 'all', count: 21 },
  { title: 'pemula', type: 'beginner', count: 7 },
  { title: 'menengah', type: 'intermediate', count: 7 },
  { title: 'mahir', type: 'advance', count: 7 },
];

function handleIndividualCheckboxChange(items, name, checked, state, setState, key = 'title') {
  const newState = { ...state };

  if (name === 'semua' && checked) {
    items.forEach((item) => {
      newState[item[key]] = item[key] === 'semua';
    });
  } else if (name === 'semua' && !checked) {
    newState['semua'] = false;
  } else if (name !== 'semua' && checked) {
    newState[name] = true;
    newState['semua'] = false;
  } else if (name !== 'semua' && !checked) {
    newState[name] = false;
    newState['semua'] = false;
  }
  setState(newState);
}

function handleSingleActiveCheckboxChange(items, name, checked, setState, key = 'type') {
  const newState = {};
  if (checked) {
    items.forEach((item) => {
      newState[item[key]] = item[key] === name;
    });
  } else {
    items.forEach((item) => {
      newState[item[key]] = item[key] === 'all';
    });
  }
  setState(newState);
}

function getInitialChecked(items, key = 'title') {
  const checked = {};
  items.forEach((item) => {
    checked[item[key]] = item[key] === 'semua';
  });
  return checked;
}

function getInitialCheckedSingle(items, key = 'type') {
  const checked = {};
  items.forEach((item) => {
    checked[item[key]] = item[key] === 'all';
  });
  return checked;
}

export default function FilterCard() {
  const [checkedCategories, setCheckedCategories] = useState(() =>
    getInitialChecked(categories, 'title')
  );
  const [checkedInstructor, setCheckedInstructor] = useState(() =>
    getInitialChecked(instructor, 'name')
  );
  const [checkedRatings, setCheckedRatings] = useState({});
  const [checkedPrice, setCheckedPrice] = useState(() => getInitialCheckedSingle(price, 'type'));
  const [checkedLevel, setCheckedLevel] = useState(() => getInitialCheckedSingle(level, 'type'));

  return (
    <div className="w-full flex flex-col h-fit p-8 shadow-md rounded-md">
      <div className="w-full p-4 justify-center items-center">
        <p className="text-xl text-center text-secondary-800">Filter Kursus</p>
      </div>
      <div className="mt-8 flex flex-col gap-8">
        {/* Kategori */}
        <div className="flex flex-col gap-2">
          <p className="w-full pb-1 border-b border-secondary-800 text-secondary-800">Kategori</p>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={cat.title}
                    checked={!!checkedCategories[cat.title]}
                    onChange={({ target: { name, checked } }) =>
                      handleIndividualCheckboxChange(
                        categories,
                        name,
                        checked,
                        checkedCategories,
                        setCheckedCategories,
                        'title'
                      )
                    }
                    className={'w-4 h-4'}
                  />
                  <p>{cat.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedCategories[cat.title] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {cat.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <p className="w-full pb-1 border-b border-secondary-800 text-secondary-800">Rating</p>
          <div className="flex flex-col gap-2">
            {rating.map((rate) => (
              <div key={rate.rating} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={String(rate.rating)}
                    checked={!!checkedRatings[rate.rating]}
                    onChange={({ target: { name, checked } }) =>
                      setCheckedRatings((prev) => ({
                        ...prev,
                        [name]: checked,
                      }))
                    }
                    className={'w-4 h-4'}
                  />
                  <StarRating value={rate.rating} size={6} />
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedRatings[rate.rating] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {rate.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Instruktur */}
        <div className="flex flex-col gap-2">
          <p className="w-full pb-1 border-b border-secondary-800 text-secondary-800">Instruktur</p>
          <div className="flex flex-col gap-2">
            {instructor.map((ins) => (
              <div key={ins.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={ins.name}
                    checked={!!checkedInstructor[ins.name]}
                    onChange={({ target: { name, checked } }) =>
                      handleIndividualCheckboxChange(
                        instructor,
                        name,
                        checked,
                        checkedInstructor,
                        setCheckedInstructor,
                        'name'
                      )
                    }
                    className={'w-4 h-4'}
                  />
                  <p>{ins.name}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedInstructor[ins.name] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {ins.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Harga */}
        <div className="flex flex-col gap-2">
          <p className="w-full pb-1 border-b border-secondary-800 text-secondary-800">Harga</p>
          <div className="flex flex-col gap-2">
            {price.map((p) => (
              <div key={p.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={p.type}
                    checked={!!checkedPrice[p.type]}
                    onChange={({ target: { name, checked } }) =>
                      handleSingleActiveCheckboxChange(
                        price,
                        name,
                        checked,
                        setCheckedPrice,
                        'type'
                      )
                    }
                    className={'w-4 h-4'}
                  />
                  <p>{p.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedPrice[p.type] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {p.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-2">
          <p className="w-full pb-1 border-b border-secondary-800 text-secondary-800">Level</p>
          <div className="flex flex-col gap-2">
            {level.map((lvl) => (
              <div key={lvl.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    box
                    name={lvl.type}
                    checked={!!checkedLevel[lvl.type]}
                    onChange={({ target: { name, checked } }) =>
                      handleSingleActiveCheckboxChange(
                        level,
                        name,
                        checked,
                        setCheckedLevel,
                        'type'
                      )
                    }
                    className={'w-4 h-4'}
                  />
                  <p>{lvl.title}</p>
                </div>
                <p
                  className={`p-[1px] px-2 rounded-md text-white ${
                    checkedLevel[lvl.type] ? 'bg-primary-700' : 'bg-secondary-500'
                  }`}
                >
                  {lvl.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
