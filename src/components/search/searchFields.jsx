import Icon from '../icons/icon';

export default function SearchFields({ categories }) {
  const handleSubmit = (event) => {};
  return (
    <div className="w-full h-full bg-white">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          placeholder="Cari Course..."
          className="appearance-none bg-transparent border border-gray-300 rounded-xl w-full text-gray-700 py-3 px-6 leading-tight focus:outline-none pr-14 text-lg"
        />
        <button type="submit" className="absolute right-2 top-2 mr-2 text-sm py-1 px-2 rounded">
          <Icon type={'magnifying-glass'} className={''} />
        </button>
      </form>
    </div>
  );
}
